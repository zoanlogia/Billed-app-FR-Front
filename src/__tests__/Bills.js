/**
 * @jest-environment jsdom
 */
import { expect, jest, test } from '@jest/globals';
import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import userEvent from "@testing-library/user-event";
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import {mockedStore, mockedBills} from "../__mocks__/store";
import Bills from "../containers/Bills.js"
=======
=======
>>>>>>> parent of 5032a28 (test)
=======
>>>>>>> parent of 5032a28 (test)

>>>>>>> parent of 5032a28 (test)
import router from "../app/Router.js";

jest.mock("../app/store", () => mockedStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("the bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();

      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
    })

    test("the bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    // I test if the buttonNewClick is handled the I test the handleClickNewBill function

    test("the it should open a modal", () => {
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const bills = new Bills({
        document, onNavigate, firestore, localStorage: window.localStorage
      })
      const handleClickNewBill = jest.fn(bills.handleClickNewBill)
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      buttonNewBill.addEventListener('click', handleClickNewBill)
      buttonNewBill.click()
      expect(handleClickNewBill).toHaveBeenCalled()
    })
=======

    // I test if the buttonNewClick is handled then I test the handleClickNewBill function
    
>>>>>>> parent of 5032a28 (test)
=======

    // I test if the buttonNewClick is handled then I test the handleClickNewBill function
    
>>>>>>> parent of 5032a28 (test)
=======

    // I test if the buttonNewClick is handled then I test the handleClickNewBill function
    
>>>>>>> parent of 5032a28 (test)
  })

  describe("When I click on one eye icon", () => {
    test(" a modal should open", async () => {
      const onNavigate = pathname => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const billsPage = new Bills({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: window.localStorage,
      });

      document.body.innerHTML = BillsUI({ data: bills });
      const iconEyes = screen.getAllByTestId("icon-eye");
      const handleClickIconEye = jest.fn(billsPage.handleClickIconEye);
      const modale = document.getElementById("modaleFile");
      $.fn.modal = jest.fn(() => modale.classList.add("show")); //mock de la modale Bootstrap

      iconEyes.forEach(iconEye => {
        iconEye.addEventListener("click", () => handleClickIconEye(iconEye));
        userEvent.click(iconEye);
        expect(handleClickIconEye).toHaveBeenCalled();
        expect(modale.classList.contains("show")).toBeTruthy();
      });
    });

    describe("When I went on Bills page and it is loading", () => {
      test(" Loading page should be rendered", () => {
        document.body.innerHTML = BillsUI({ loading: true });
        expect(screen.getAllByText("Loading...")).toBeTruthy();
        document.body.innerHTML = "";
      });

      test(" Error page should be rendered", () => {
        document.body.innerHTML = BillsUI({ error: "some error message" });
        expect(screen.getAllByText("Erreur")).toBeTruthy();
        document.body.innerHTML = "";
      })
    });
  })
});
