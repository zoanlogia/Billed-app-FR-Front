/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { mockedBills} from "../__mocks__/store";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/dom";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.Bills);
        await waitFor(() => screen.getByTestId('icon-window'));
        const windowIcon = screen.getByTestId('icon-window');
        //to-do write expect expression
        expect(windowIcon.classList.contains('active-icon')).toBeTruthy();
      })

    test("the bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

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
  })

  describe("When I click on the one eye icon", () => {
    test("A modal should open", () => {
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
  })

    describe("When I click on new bill button ", () => {
      test("Then a modal should open", () => {
        document.body.innerHTML = BillsUI({data: bills,});
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname, }); };
        const newBill = new Bills({ document, onNavigate, store: null, bills, localStorage: localStorageMock})          
        const handleClickNewBill = jest.fn((e) => newBill.handleClickNewBill(e, bills)) 
        const iconNewBill = screen.getByTestId("btn-new-bill");
        iconNewBill.addEventListener("click", handleClickNewBill);
        fireEvent.click(iconNewBill);
        /* vérification de l'appel de la fonction handleClickNewBill */
        expect(handleClickNewBill).toHaveBeenCalled();
         /* vérification de l'affichage de la modale par la présence du noeud DOM
         id="form-new-bill") */
        const modale = screen.getAllByTestId("form-new-bill");
        expect(modale).toBeTruthy();
      })
    })


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
      
      test("fetches bills from mock API GET", async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
        const billsList = new Bills({document, onNavigate, store : mockedBills, localStorage: null})
        const bills = await billsList.getBills()
        document.body.innerHTML = BillsUI({ data: bills })
        const billsCount  = await screen.getByTestId("tbody").childElementCount
        /* Vérification si les 4 bills du mock sont récupérées*/
        expect(billsCount).toEqual(4)
      })
    });
})
