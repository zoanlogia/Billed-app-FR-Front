/**
 * @jest-environment jsdom
 */
import { expect, jest, test } from '@jest/globals';
import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import userEvent from "@testing-library/user-event";
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
// import {mockedStore, mockedBills} from "../__mocks__/store";
// import Bills from "../containers/Bills.js"

import router from "../app/Router.js";

// jest.mock("../app/store", () => mockedStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("the bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
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
      //to-do write expect expression

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
});
