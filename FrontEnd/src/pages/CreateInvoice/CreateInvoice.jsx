import style from "./CreateInvoice.module.css";
import { useState } from "react";

/**
 * Flugur ERP — Create New AP Invoice
 * Re-skinned with the Flugur ERP dark design system.
 * Architecture matches the original LedgerPro screen 1:1 —
 * only visual language (color, type, surfaces) has been swapped.
 */

export default function CreateInvoice() {
    const [lineItems, setLineItems] = useState([
  {
     id: 1,
    description: "Cloud Hosting Services - Oc",
    qty: "1",
    unitPrice: "$ 1250.00",
    glAccount: "6200 - IT Services",
    taxRate: "7% (Standard)",
    amount: "$1,250.00",
  },
  {
     id: 2,
    description: "Premium Support Add-on",
    qty: "1",
    unitPrice: "$ 250.00",
    glAccount: "6200 - IT Services",
    taxRate: "7% (Standard)",
    amount: "$250.00",
  },
]);

const handleDelete = (id) => {
  setLineItems(lineItems.filter((item) => item.id !== id));
};
  return (
    <div className={style.page}>
 
      {/* Main */}
      <div className={style.main}>
       

        <div className={style.container}>

          {/* Top form fields */}
          <div className={style.formCard}>
            <div className={style.formGrid3}>
              <div>
                <label className={style.label}>Vendor Selection</label>
                <select className={style.input}>
                  <option>Select Vendor...</option>
                </select>
              </div>
              <div>
                <label className={style.label}>Invoice Number</label>
                <div className={style.inputWithIconWrap}>
                  <input className={style.inputWithIcon} defaultValue="INV-2023-0045" />
                  <span className={style.refreshIcon}>
                    <i className="bi bi-arrow-repeat"></i>
                  </span>
                </div>
              </div>
              <div>
                <label className={style.label}>Accounting Period</label>
                <select className={style.input}>
                  <option>FY23-Q4 (Oct 2023)</option>
                </select>
              </div>
            </div>

            <div className={style.formGrid3Second}>
              <div>
                <label className={style.label}>Invoice Date</label>
                <input className={style.input} type="date" placeholder="mm/dd/yyyy" />
              </div>
              <div>
                <label className={style.label}>Due Date</label>
                <input className={style.input} type="date" placeholder="mm/dd/yyyy" />
              </div>
              <div>
                <label className={style.label}>Payment Terms</label>
                <select className={style.input}>
                  <option>Net 30</option>
                </select>
              </div>
            </div>
          </div>

          {/* Billable Line Items */}
          <div className={style.lineItemsCard}>
            <div className={style.lineItemsHeader}>
              <div className={style.lineItemsTitle}>Billable Line Items</div>
              <button className={style.btnPrimary}>
                <i className="bi bi-plus-lg"></i> Add Line
              </button>
            </div>

            <div className={style.theadRow}>
              <div className={style.th}>Description</div>
              <div className={style.th}>Qty</div>
              <div className={style.th}>Unit Price</div>
              <div className={style.th}>GL Account</div>
              <div className={style.th}>Tax Rate</div>
              <div className={style.th}>Amount</div>
              <div className={style.th}></div>
            </div>

            {lineItems.map((item) => (
              <div key={item.id} className={item.id === lineItems.length - 1 ? style.trLast : style.tr}>
                <div className={style.cellText}>{item.description}</div>
                <div className={style.cellText}>{item.qty}</div>
                <div className={style.cellText}>{item.unitPrice}</div>
                <div className={style.cellTextMuted}>{item.glAccount}</div>
                <div className={style.cellTextMuted}>{item.taxRate}</div>
                <div className={style.amountText}>{item.amount}</div>
                <div className={style.deleteIcon} onClick={() => handleDelete(item.id)}>
                  <i className="bi bi-trash3"></i>
                </div>
              </div>
            ))}
          </div>

          {/* Notes + Financial Summary */}
          <div className={style.bottomGrid}>
            <div className={style.notesCard}>
              <div className={style.notesLabel}>Internal Notes</div>
              <textarea
                className={style.textarea}
                placeholder="Add any internal context for the approval team..."
              />
            </div>

            <div className={style.summaryCard}>
              <div className={style.summaryTitle}>Financial Summary</div>
              <div className={style.summaryRow}>
                <span>Subtotal</span>
                <span>$1,500.00</span>
              </div>
              <div className={style.summaryRow}>
                <span>Tax Amount (7%)</span>
                <span>$105.00</span>
              </div>
              <div className={style.summaryDivider} />
              <div className={style.summaryTotalRow}>
                <span className={style.summaryTotalLabel}>Total Amount</span>
                <span className={style.summaryTotalValue}>$1,605.00</span>
              </div>
              <div className={style.summaryNote}>
                Values are calculated in real-time based on line items.
              </div>
            </div>
          </div>

          {/* Upload zone */}
          <div className={style.uploadZone}>
            <label className={style.uploadIcon} htmlFor="invoiceFile">
                 <input
    id="invoiceFile"
    type="file"
    accept=".pdf,image/*"
    hidden
  />
              <i className="bi bi-upload"></i>

            <div className={style.uploadTitle}>Upload Invoice PDF/Image</div>
            <div className={style.uploadSub}>Drag and drop or click to browse</div>
            </label>
          </div>
            


        </div>

        {/* Footer bar */}
        <div className={style.footerBar}>
          <button className={style.btnGhost}>Cancel</button>
          <div className={style.footerRight}>
            <button className={style.btnOutline}>Save as Draft</button>
            <button className={style.btnSubmit}>
              Submit for Approval <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}