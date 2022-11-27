/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import mockStore from "../__mocks__/store"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should display the new bill page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
    })
    it("should display the form", async () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const html = NewBillUI()
      document.body.innerHTML = html
      const form = screen.getByTestId('form-new-bill')
      expect(form).toBeTruthy()
    })
  })

  describe("When I am on NewBill Page and I submit the form", () => {
    test("Then it should create a new bill", () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const newBill = new NewBill({
        document, onNavigate, firestore, store: mockStore, localStorage: window.localStorage
      })
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener('submit', handleSubmit)
      form.submit()
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe("When I am on NewBill Page and I submit the form", () => {
    test("the extensions allowed for the input type file should be png, jpeg or jpg only", () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const newBill = new NewBill({
        document, onNavigate, firestore, store: mockStore, localStorage: window.localStorage
      })
      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener('change', handleChangeFile)
      file.change()
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })
})
