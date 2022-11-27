/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : (a > b) ? -1 : 0)
      // const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("I can click on new bill button and navigate to new Bill page", () => {

      //on fabrique la page (<div>...</div>)
      document.body.innerHTML = BillsUI({
        data: bills
      })
      //On créer une fonction OnNavigate qui permet de naviguer sur les liens de la page
      //mais qui est demandée à la création de l'objet NewBill
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // On modifie le localStorage en le remplacant par le notre
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      //permet de set si on est employé ou admin
      window.localStorage.setItem('user', JSON.stringify({ type: 'employee' }))
      // enfin on peut creer notre class qui vérifie la page
      const BillsController = new Bills({ document, onNavigate, store: null, localStorage: window.localStorage })

      const spy = jest.spyOn(BillsController, 'onNavigate');

      const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)

      buttonNewBill.click()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()

    });
    describe("When i click on one icon eye", () => {
      //async?
      test("An event should occur and a modal should open", () => {
  
        // création d'un DOM virtuel + son controller    
        const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({ type: 'employee' }))
  
        const BillsController = new Bills({ document, onNavigate, store: null, localStorage: window.localStorage })
  
        document.body.innerHTML = BillsUI({ data: bills })
  
        // on mock la fonction handleClickIconEye
        const handleClickIconEye = jest.fn(BillsController.handleClickIconEye)
  
        const iconEyes = screen.getAllByTestId("icon-eye")
        iconEyes.forEach(icon => {
          icon.addEventListener('click', handleClickIconEye(icon))
          userEvent.click(icon)
  
          expect(handleClickIconEye).toHaveBeenCalled()
          const modale = waitFor(() => screen.getByTestId('modaleFile'))
          expect(modale).toBeTruthy()
        });
      });
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page once i am connected", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
    })

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })

      // erreur 404
      test("fetches bills from an API and fails with 404 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      // erreur 500
      test("fetches messages from an API and fails with 500 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})