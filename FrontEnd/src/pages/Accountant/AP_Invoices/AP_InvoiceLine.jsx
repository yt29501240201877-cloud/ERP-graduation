import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { ChevronDown, Pencil, Trash2, Plus, Save, Send, Loader2, CheckCircle2 } from "lucide-react";
import Style from './AP_InvoiceLine.module.css'
import api from '../../../components/api'

const STORAGE_KEY = "ledgerpro:invoice-lines:INV-2024-0892";

const GL_ACCOUNTS = [
  "6100 - Freight & Shipping",
  "6200 - Warehouse Rent",
  "6300 - Office Supplies",
  "6400 - Utilities",
];
const TAX_RATES = [
  { label: "0% - Exempt", value: 0 },
  { label: "5% - Reduced Rate", value: 5 },
  { label: "10% - Standard Rate", value: 10 },
  { label: "20% - Luxury Rate", value: 20 },
];

const SEED_STATE = {
  header: {
    invNo: "INV-2024-0892",
    vendor: "Global Logistics Solutions Inc.",
    invDate: "2023-10-24",
    dueDate: "2023-11-23",
  },
};

function currency(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function InvoiceLineItemsDark() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingHeader, setEditingHeader] = useState(false);
  const [headerDraft, setHeaderDraft] = useState(SEED_STATE.header);

  const [editingLineId, setEditingLineId] = useState(null);
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("1.00");
  const [unitPrice, setUnitPrice] = useState("");
  const [gl, setGl] = useState(GL_ACCOUNTS[0]);
  const [taxRate, setTaxRate] = useState(10);

  const { id } = useParams();


  useEffect(() => {
    const getInvoices = async () => {
      try {
        const res = await api.get(`/ap_invoices/${id}`);
        setData(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) getInvoices();
  }, [id]);





  const persist = async (next) => {
    setData(next);
    setSaving(true);
    try {
      const result = await window.storage.set(STORAGE_KEY, JSON.stringify(next), false);
      if (!result) setError("Save failed — changes may not persist.");
      else setError("");
    } catch (e) {
      setError("Save failed — changes may not persist.");
    } finally {
      setSaving(false);
    }
  };

  const clearFields = () => {
    setEditingLineId(null);
    setDesc("");
    setQty("1.00");
    setUnitPrice("");
    setGl(GL_ACCOUNTS[0]);
    setTaxRate(10);
  };

  const startEditLine = (line) => {
    setEditingLineId(line.id);
    setDesc(line.desc);
    setQty(String(line.qty));
    setUnitPrice(String(line.unitPrice));
    setGl(line.gl);
    setTaxRate(line.taxRate);
  };

  const saveLine = async (e) => {
    e.preventDefault();
    const q = parseFloat(qty);
    const up = parseFloat(unitPrice);
    if (!desc.trim() || !q || q <= 0 || !up || up < 0) return;

    let nextLines;
    if (editingLineId) {
      nextLines = data.lines.map((l) =>
        l.id === editingLineId ? { ...l, desc: desc.trim(), qty: q, unitPrice: up, gl, taxRate } : l
      );
    } else {
      const newLine = { id: `l${Date.now()}`, desc: desc.trim(), qty: q, unitPrice: up, gl, taxRate };
      nextLines = [...data.lines, newLine];
    }
    await persist({ ...data, lines: nextLines });
    clearFields();
  };

  const deleteLine = async (id) => {
    await persist({ ...data, lines: data.lines.filter((l) => l.id !== id) });
    if (editingLineId === id) clearFields();
  };

  const saveHeader = async () => {
    await persist({ ...data, header: headerDraft });
    setEditingHeader(false);
  };

  const cancelDraft = async () => {
    if (window.confirm("Reset this invoice draft to its original state? This clears all line item changes.")) {
      await persist(SEED_STATE);
      setHeaderDraft(SEED_STATE.header);
      clearFields();
    }
  };

  const finalizeInvoice = async () => {
    await persist({ ...data, status: "Submitted" });
  };

  const lineAmounts = (() => {
    if (!data?.lines || !Array.isArray(data.lines)) return [];

    return data.lines.map((l) => {
      const desc = l.description;
      const quantity = l.quantity || 0;
      const unitPrice = l.unit_price || 0;
      const amount = quantity * unitPrice;

      const taxRate = l.tax_rate_id?.rate || l.taxRate || 0;
      const taxAmt = amount * (taxRate / 100);

      return {
        ...l,
        amount,
        taxAmt,
      };
    });
  })();

  const subtotal = lineAmounts.reduce((s, l) => s + l.amount, 0);
  const taxTotal = lineAmounts.reduce((s, l) => s + l.taxAmt, 0);
  const total = subtotal + taxTotal;
  const isSubmitted = data?.status === "APPROVED";

  return (
    <main className={Style.apcontent}>
      {isSubmitted && (
        <div className={Style.apsubmittedbanner}>
          <CheckCircle2 size={16} /> This invoice has been finalized and submitted for payment processing.
        </div>
      )}

      <div className={Style.apheaderbar}>
        <div className={Style.apheaderfield}>
          <div className={Style.apheaderlabel}>Invoice Number</div>
          <div className={Style.apheadervalue}>{data?.invoice_number}</div>
        </div>

        <div className={Style.apheaderfield} style={{ flex: 1 }}>
          <div className={Style.apheaderlabel}>Vendor</div>
          {editingHeader ? (
            <input
              className={Style.apheaderinput}
              value={data.vendor_id?.name}
              onChange={(e) => setHeaderDraft({ ...headerDraft, vendor: e.target.value })}
            />
          ) : (
            <div className={Style.apheadervalue}>{data?.vendor_id?.name}</div>
          )}
        </div>

        <div className={Style.apheaderfield}>
          <div className={Style.apheaderlabel}>Invoice Date</div>
          {editingHeader ? (
            <input
              type="date"
              className={Style.apheaderinput}
              value={data.invoice_date}
              onChange={(e) => setHeaderDraft({ ...headerDraft, invDate: e.target.value })}
            />
          ) : (
            <div className={Style.apheadervalue}>{formatDate(data?.invoice_date)}</div>
          )}
        </div>

        <div className={Style.apheaderfield}>
          <div className={Style.apheaderlabel}>Due Date</div>
          {editingHeader ? (
            <input
              type="date"
              className={Style.apheaderinput}
              value={data.due_date}
              onChange={(e) => setHeaderDraft({ ...headerDraft, dueDate: e.target.value })}
            />
          ) : (
            <div className={`${Style.apheadervalue} ${Style.apdue}`}>{formatDate(data?.due_date)}</div>
          )}
        </div>

        <div className={Style.apheaderactions}>
          {editingHeader ? (
            <button className={Style.apbtnsolid} onClick={saveHeader}>Save Progress</button>
          ) : (
            <button className={Style.apbtnoutline} onClick={() => { setHeaderDraft(data.header); setEditingHeader(true); }}>
              Edit Header
            </button>
          )}
          <button className={Style.apbtnsolid} disabled={saving} onClick={() => persist(data)}>
            {saving ? <Loader2 size={14} className={Style.apspin} /> : "Save Progress"}
          </button>
        </div>
      </div>

      <div className={Style.aplayout}>
        <div className={Style.aplinescard}>
          <div className={Style.aplineshead}>
            <span className={Style.aplinestitle}>Line Items</span>
            <span className={Style.aptotalchip}>Total Items: {data?.lines.length}</span>
          </div>

          <table className={Style.aptable}>
            <thead>
              <tr className={Style.aptheadrow}>
                <th className={Style.apth}>Description</th>
                <th className={Style.apth}>Qty</th>
                <th className={Style.apth}>Unit Price</th>
                <th className={Style.apth}>GL Account</th>
                <th className={Style.apth}>Tax</th>
                <th className={Style.apth}>Amount</th>
                <th className={Style.apth}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className={Style.apempty}><td colSpan={7}>Loading invoice…</td></tr>
              ) : lineAmounts.length === 0 ? (
                <tr className={Style.apempty}><td colSpan={7}>No line items yet. Add one using the form.</td></tr>
              ) : (
                lineAmounts.map((l) => {
                  return (
                    <tr key={l._id} className={`${Style.aprow} ${editingLineId === l._id ? Style.aprowediting : ""}`}>
                      <td className={`${Style.aptd} ${Style.aptddesc}`}>{l.description}</td>
                      <td className={Style.aptd}>{l.quantity.toFixed(2)}</td>
                      <td className={Style.aptd}>{currency(l.unit_price)}</td>
                      <td className={`${Style.aptd} ${Style.aptdgl}`}>{l.account_id.name}</td>
                      <td className={`${Style.aptd} ${Style.aptdtax}`}>{l.taxRate}%</td>
                      <td className={`${Style.aptd} ${Style.aptdamount}`}>{currency(l.amount)}</td>
                      <td className={Style.aptd}>
                        <div className={Style.aptdactions}>
                          <button className={Style.apactionicon} onClick={() => startEditLine(l)} aria-label="Edit"><Pencil size={13} /></button>
                          <button className={`${Style.apactionicon} ${Style.apdanger}`} onClick={() => deleteLine(l.id)} aria-label="Delete"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <button
            className={Style.apaddrow}
            onClick={() => { clearFields(); document.getElementById("ap-desc-input")?.focus(); }}
          >
            <Plus size={16} /> Add New Row
          </button>
        </div>

        <div className={Style.apformcard}>
          <div className={Style.apformtitle}>{editingLineId ? "Edit Line Entry" : "New Line Entry"}</div>

          <form onSubmit={saveLine}>
            <div className={Style.apfield}>
              <label className={Style.apfieldlabel}>Description</label>
              <textarea
                id="ap-desc-input"
                className={Style.aptextarea}
                placeholder="Enter item details..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div className={Style.aprow2} style={{ marginBottom: "1.1rem" }}>
              <div className={Style.apfield} style={{ marginBottom: 0 }}>
                <label className={Style.apfieldlabel}>Quantity</label>
                <input type="number" step="0.01" className={Style.apinput} value={qty} onChange={(e) => setQty(e.target.value)} />
              </div>
              <div className={Style.apfield} style={{ marginBottom: 0 }}>
                <label className={Style.apfieldlabel}>Unit Price</label>
                <div className={Style.apcurrencywrap}>
                  <span className={Style.apcurrencysymbol}>$</span>
                  <input type="number" step="0.01" className={Style.apinput} placeholder="0.00" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                </div>
              </div>
            </div>

            <div className={Style.apfield}>
              <label className={Style.apfieldlabel}>GL Account Selection</label>
              <div className={Style.apselectwrap}>
                <select className={Style.apselect} value={gl} onChange={(e) => setGl(e.target.value)}>
                  {GL_ACCOUNTS.map((g) => <option key={g}>{g}</option>)}
                </select>
                <ChevronDown size={14} className={Style.apselectcaret} />
              </div>
            </div>

            <div className={Style.apfield}>
              <label className={Style.apfieldlabel}>Tax Rate Selection</label>
              <div className={Style.apselectwrap}>
                <select className={Style.apselect} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))}>
                  {TAX_RATES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <ChevronDown size={14} className={Style.apselectcaret} />
              </div>
            </div>

            <div className={Style.apformdivider} />

            <button type="submit" className={Style.apbtnsaveline} disabled={saving || !desc.trim() || !unitPrice}>
              {saving ? <Loader2 size={15} className={Style.apspin} /> : <><Save size={15} /> {editingLineId ? "Update Line Item" : "Save Line Item"}</>}
            </button>
            <button type="button" className={Style.apbtnclearfields} onClick={clearFields}>Clear Fields</button>
          </form>
        </div>
      </div>

      <div className={Style.apsummarybar}>
        <div className={Style.apsummaryitem}>
          <div className={Style.apsummarylabel}>Subtotal</div>
          <div className={Style.apsummaryvalue}>{currency(subtotal)}</div>
        </div>
        <div className={Style.apsummaryitem}>
          <div className={Style.apsummarylabel}>Tax Amount</div>
          <div className={Style.apsummaryvalue}>{currency(taxTotal)}</div>
        </div>
        <div className={Style.apsummarydivider} />
        <div className={`${Style.apsummaryitem} ${Style.apsummarytotal}`}>
          <div className={Style.apsummarylabel}>Total Invoice Amount</div>
          <div className={Style.apsummaryvalue}>{currency(total)}</div>
        </div>
        <div className={Style.apsummaryactions}>
          <button className={Style.apbtncanceldraft} onClick={cancelDraft}>Cancel Draft</button>
          <button className={Style.apbtnfinalize} disabled={isSubmitted || saving} onClick={finalizeInvoice}>
            <Send size={15} /> {isSubmitted ? "Submitted" : "Finalize & Submit Invoice"}
          </button>
        </div>
      </div>

      <div className={`${Style.apstatusbar} ${error ? Style.apstatuserror : ""}`}>
        {saving ? "Saving changes…" : error ? error : "All changes are saved automatically to your workspace."}
      </div>
    </main>
  );
}
