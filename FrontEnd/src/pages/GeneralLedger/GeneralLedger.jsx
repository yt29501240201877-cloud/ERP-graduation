import { useState } from "react";
import GlowBtn from "../../components/ui/GlowBtn/GlowBtn";
import SolidBtn from "../../components/ui/SolidBtn/SolidBtn";
import Styles from "./GeneralLedger.module.css";

export default function GeneralLedger() {
  const [Users, setUsers] = useState([
    {
      code: "1001-1001",
      accName: "Main Operating Cash",
      type: "ASSET",
      balance: "DEBIT",
      status: "Active",
    },
    {
      code: "2100-010",
      accName: "Accounts Payable",
      type: "LIABILITY",
      balance: "CREDIT",
      status: "Active",
    },
    {
      code: "4000-001",
      accName: "Service Revenue",
      type: "REVENUE",
      balance: "CREDIT",
      status: "Active",
    },
    {
      code: "6000-050",
      accName: "Office Lease Expense",
      type: "EXPENSE",
      balance: "DEBIT",
      status: "Locked",
    },
    {
      code: "3100-001",
      accName: "Retained Earnings",
      type: "EQUITY",
      balance: "CREDIT",
      status: "Active",
    },
  ]);

  return (
    <>
      <div className={`${Styles.mainCon} px-3 py-2`}>
        <div className="addAcc">
          <h1 className="fs-5 fw-bold text-light">Add New Account</h1>
          <p className="fs-sm">Configure a new general ledger identity.</p>
        </div>

        <div className={`${Styles.ctrlAccForm} p-3 rounded-3`}>
          <div className="ctrlFields d-flex justify-content-between px-2 col-12 gap-5">
            <div className="d-flex flex-column gap-1 col-3">
              <label htmlFor="accountName">ACCOUNT NAME</label>
              <input
                className={`${Styles.inputBorder} ps-3 rounded bg-transparent p-2`}
                type="text"
                name="accountName"
                placeholder="e.g. Operating Cash"
                id="accountName"
              />
            </div>

            <div className="d-flex flex-column gap-1 col-3">
              <label htmlFor="accountType">ACCOUNT TYPE</label>
              <select
                name="accountType"
                id="accountType"
                className={`${Styles.SelectorList} ps-3 rounded bg-transparent p-2`}
              >
                <option value="" selected disabled>
                  Select Type
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            <div className="d-flex flex-column gap-1 col-3">
              <label htmlFor="subType">SUBTYPE</label>
              <select
                name="subType"
                id="subType"
                className={`${Styles.SelectorList} ps-3 rounded bg-transparent p-2`}
              >
                <option value="" selected disabled>
                  Current Asset
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            <div className="d-flex flex-column gap-1 col-auto">
              <span>NORMAL BALANCE</span>

              <div className="d-flex gap-2">
                <SolidBtn text="DEBIT" className="flex-grow-1" />
                <SolidBtn text="CREDIT" className="flex-grow-1" />
              </div>
            </div>
          </div>
          <hr className="border-dark-subtle mx-2" />

          <div className="ctrlSecCon d-flex justify-content-between mx-2 align-items-center">
            <div>
              <h2 className="fs-5 fw-bold text-light">Control Account</h2>
              <p className="fs-sm">Summarizes sub-ledger activity</p>
            </div>
            <div className="d-flex gap-2">
              <GlowBtn text="Save Account" />
              <SolidBtn text="Clear" />
            </div>
          </div>
        </div>

        <div className="addAcc d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 className="fs-5 fw-bold text-light">Retrieve Accounts</h1>
            <p className="fs-sm">Ledger &gt; Accounts </p>
          </div>

          <div className="d-flex gap-3">
            <div className="position-relative">
              <i className="bi bi-funnel position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
              <input
                type="text"
                placeholder="Filter by Name or Type..."
                className={`${Styles.inputBorder} form-control ps-5 rounded bg-transparent p-2`}
                name="filterNameOrType"
              />
            </div>
            <SolidBtn icon="bi bi-download" text="Export" />
          </div>
        </div>

        <div
          className={`${Styles.usersTable} overflow-hidden d-flex flex-column flex-grow-1 rounded-3`}
        >
          <table className="w-100">
            <thead>
              <tr>
                <th className="ps-3 py-3">CODE</th>
                <th>ACCOUNT NAME</th>
                <th>TYPE</th>
                <th>BALANCE</th>
                <th>STATUS</th>
                <th className="text-center pe-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {Users.map((item) => (
                <tr key={item.code} className={Styles.tableRow}>
                  <td className="ps-3 py-3">{item.code}</td>
                  <td className="fw-bold">{item.accName}</td>
                  <td>{item.type}</td>
                  <td className="fw-bold">{item.balance}</td>
                  <td
                    className={`${item.status === "Active" ? "text-success" : "text-warning"} fw-bold`}
                  >
                    ● {item.status}
                  </td>
                  <td className="text-center">
                    <button className="bg-transparent text-light border-0">
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-baseline pt-2 px-3">
            <p>Showing 1-5 of 124 accounts</p>
            <div className="d-flex gap-1">
              <SolidBtn icon="bi bi-chevron-left" />
              <SolidBtn text="1" />
              <SolidBtn text="2" />
              <SolidBtn icon="bi bi-chevron-right" />
            </div>
          </div>
        </div>

        <div className={`${Styles.quickGuide} mt-4 p-2 rounded-3`}>
          <h3>
            <i className="bi bi-info-circle me-1"></i> QUICK GUIDE
          </h3>
          <p className="ms-4">
            Control accounts like Accounts Receivable cannot be posted to
            directly in the General Journal.
          </p>
        </div>
      </div>
    </>
  );
}
