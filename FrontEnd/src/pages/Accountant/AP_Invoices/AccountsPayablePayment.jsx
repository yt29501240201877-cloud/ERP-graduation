import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Wallet,
  Plus,
  TrendingUp,
  Clock,
  ShieldCheck,
  Filter,
  Download,
  Landmark,
  Loader2,
  Banknote,
  X,
} from "lucide-react";

import Style from "./AP_Payment.module.css"

const STORAGE_KEY = "accounts-payable:payments";

const SEED_PAYMENTS = [
  { id: "p1", date: "2023-10-24", ref: "BT-001294", method: "Bank Transfer", vendor: "Global Logistics Inc.", invoice: "Inv #8821, #8822", amount: 12450, status: "Completed", journalId: "JH-000112" },
  { id: "p2", date: "2023-10-23", ref: "CK-00992", method: "Check", vendor: "Tech Solutions Ltd.", invoice: "Inv #4500-B", amount: 3200, status: "Processing", journalId: "JH-000111" },
  { id: "p3", date: "2023-10-21", ref: "BT-001288", method: "Bank Transfer", vendor: "Apex Industrial Supply", invoice: "Inv #7710", amount: 8420, status: "Completed", journalId: "JH-000108" },
  { id: "p4", date: "2023-10-19", ref: "WR-00071", method: "Wire", vendor: "Nexus Fleet Ops", invoice: "Inv #2291", amount: 15600, status: "Draft", journalId: "JH-000104" },
];

const METHODS = ["Bank Transfer", "Check", "Wire", "ACH"];
const STATUSES = ["Draft", "Processing", "Completed"];

function currency(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

function StatusBadge({ status }) {
  const cls =
    status === "Completed" ? "pm-badge pm-badge-completed" : status === "Processing" ? "pm-badge pm-badge-processing" : "pm-badge pm-badge-draft";
  return <span className={cls}>{status}</span>;
}

function MethodIcon({ method }) {
  if (method === "Bank Transfer") return <Landmark size={14} />;
  if (method === "Check") return <FileText size={14} />;
  return <Banknote size={14} />;
}

export default function AccountsPayableDark() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [paymentDate, setPaymentDate] = useState("2023-10-25");
  const [method, setMethod] = useState("Bank Transfer");
  const [totalAmount, setTotalAmount] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [status, setStatus] = useState("Draft");
  const [journalId, setJournalId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [invoiceRef, setInvoiceRef] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, false);
        const parsed = result ? JSON.parse(result.value) : null;
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setPayments(parsed);
        } else {
          setPayments(SEED_PAYMENTS);
          await window.storage.set(STORAGE_KEY, JSON.stringify(SEED_PAYMENTS), false);
        }
      } catch (e) {
        try {
          setPayments(SEED_PAYMENTS);
          await window.storage.set(STORAGE_KEY, JSON.stringify(SEED_PAYMENTS), false);
        } catch (e2) {
          setError("Could not initialize payment storage.");
          setPayments(SEED_PAYMENTS);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next) => {
    setPayments(next);
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

  const clearForm = () => {
    setPaymentDate("2023-10-25");
    setMethod("Bank Transfer");
    setTotalAmount("");
    setBankRef("");
    setStatus("Draft");
    setJournalId("");
    setVendorName("");
    setInvoiceRef("");
  };

  const savePayment = async (e) => {
    e.preventDefault();
    const amt = parseFloat(totalAmount);
    if (!amt || amt <= 0) return;
    const newPayment = {
      id: `p${Date.now()}`,
      date: paymentDate,
      ref: bankRef.trim() || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      method,
      vendor: vendorName.trim() || "Unassigned Vendor",
      invoice: invoiceRef.trim() || "—",
      amount: amt,
      status,
      journalId: journalId.trim() || `JH-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    await persist([newPayment, ...payments]);
    clearForm();
  };

  const exportCsv = () => {
    const header = ["Date", "Reference", "Method", "Vendor", "Invoice", "Amount", "Status", "Journal ID"];
    const rows = filtered.map((p) => [p.date, p.ref, p.method, p.vendor, p.invoice, p.amount.toFixed(2), p.status, p.journalId]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payment-history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(
    () =>
      payments.filter(
        (p) =>
          p.ref.toLowerCase().includes(search.toLowerCase()) ||
          p.vendor.toLowerCase().includes(search.toLowerCase()) ||
          p.method.toLowerCase().includes(search.toLowerCase())
      ),
    [payments, search]
  );

  const totalOutstanding = payments.filter((p) => p.status !== "Completed").reduce((s, p) => s + p.amount, 0);
  const processing = payments.filter((p) => p.status === "Processing");
  const processingTotal = processing.reduce((s, p) => s + p.amount, 0);
  const completedCount = payments.filter((p) => p.status === "Completed").length;

  return (

        <main className={Style.pmcontent}>
          <div className={Style.pmpagehead}>
            <div>
              <h1 className={Style.pmpagetitle}>Accounts Payable</h1>
              <p className={Style.pmpagesub}>Manage vendor disbursements and transaction history</p>
            </div>
            <button className={Style.pmbtnsolid} onClick={() => document.getElementById("pm-amount-input")?.focus()}>
              <Plus size={16} /> New Payment
            </button>
          </div>

          {/* Stat cards */}
          <div className={Style.pmstatsgrid}>
            <div className={Style.pmstatcard}>
              <div className={Style.pmstattop}>
                <span className={Style.pmstatlabel}>Total Outstanding</span>
                <div className={Style.pmstaticon}><Wallet size={16} /></div>
              </div>
              <div className={Style.pmstatvalue}>{currency(totalOutstanding)}</div>
              <div className={`${Style.pmstattrend} ${Style.pmtrendup}`}><TrendingUp size={14} /> +12.4% from last month</div>
            </div>

            <div className={Style.pmstatcard}>
              <div className={Style.pmstattop}>
                <span className={Style.pmstatlabel}>Processing Payments</span>
                <div className={Style.pmstaticon}><Clock size={16} /></div>
              </div>
              <div className={Style.pmstatvalue}>{processing.length}</div>
              <div className={Style.pmtrendnote}>Totaling {currency(processingTotal)}</div>
            </div>

            <div className={Style.pmstatcard}>
              <div className={Style.pmstattop}>
                <span className={Style.pmstatlabel}>Recent Completions</span>
                <div className={Style.pmstaticon}><ShieldCheck size={16} /></div>
              </div>
              <div className={Style.pmstatvalue}>{completedCount}</div>
              <div className={Style.pmtrendblue}><ShieldCheck size={14} /> All reconciled for Q3</div>
            </div>
          </div>

          {/* New payment form */}
          <div className={Style.pmformcard}>
            <h2 className={Style.pmformtitle}>Add New Payment</h2>
            <div className={Style.pmformsub}>Record a new vendor disbursement.</div>

            <form onSubmit={savePayment}>
              <div className={Style.pmformgrid}>
                <div>
                  <label className={Style.pmfieldlabel}>Payment Date</label>
                  <input type="date" className={Style.pminput} value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                </div>
                <div>
                  <label className={Style.pmfieldlabel}>Payment Method</label>
                  <div className={Style.pmselectwrap}>
                    <select className={Style.pmselect} value={method} onChange={(e) => setMethod(e.target.value)}>
                      {METHODS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={Style.pmfieldlabel}>Total Amount</label>
                  <input
                    id="pm-amount-input"
                    type="number"
                    step="0.01"
                    className={Style.pminput}
                    placeholder="0.00"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className={Style.pmformgrid}>
                <div>
                  <label className={Style.pmfieldlabel}>Vendor Name</label>
                  <input className={Style.pminput} placeholder="e.g. Global Logistics Inc." value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
                </div>
                <div>
                  <label className={Style.pmfieldlabel}>Invoice Reference</label>
                  <input className={Style.pminput} placeholder="e.g. Inv #8821" value={invoiceRef} onChange={(e) => setInvoiceRef(e.target.value)} />
                </div>
                <div>
                  <label className={Style.pmfieldlabel}>Bank Reference</label>
                  <input className={Style.pminput} placeholder="REF-000000" value={bankRef} onChange={(e) => setBankRef(e.target.value)} />
                </div>
              </div>

              <div className={Style.pmformgrid}>
                <div>
                  <label className={Style.pmfieldlabel}>Status</label>
                  <div className={Style.pmselectwrap}>
                    <select className={Style.pmselect} value={status} onChange={(e) => setStatus(e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={Style.pmfieldlabel}>Journal ID</label>
                  <input className={Style.pminput} placeholder="JH-000000" value={journalId} onChange={(e) => setJournalId(e.target.value)} />
                </div>
              </div>

              <div className={Style.pmformactions}>
                <button type="button" className={Style.pmbtnclear} onClick={clearForm}>Clear</button>
                <button type="submit" className={Style.pmbtnsave} disabled={saving || !totalAmount}>
                  {saving ? <Loader2 size={15} className={Style.pmspin} /> : "Save Payment"}
                </button>
              </div>
            </form>
          </div>

          {/* Payment history */}
          <div className={Style.pmhistorycard}>
            <div className={Style.pmhistoryhead}>
              <span className={Style.pmhistorytitle}>Payment History</span>
              <div className={Style.pmhistoryactions}>
                <button className={`${Style.pmbtnghost} ${showFilter ? Style.pmfilteron : ""}`} onClick={() => setShowFilter(!showFilter)}>
                  <Filter size={14} /> Filter
                </button>
                <button className={Style.pmbtnghost} onClick={exportCsv}>
                  <Download size={14} /> Export
                </button>
              </div>
            </div>

            {showFilter && (
              <div className={Style.pmfilterrow}>
                <div className={Style.pmfilterinputwrap}>
                  <input
                    className={Style.pmfilterinput}
                    placeholder="Filter by reference, vendor or method..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                  {search && <X size={14} className={Style.pmfilterclear} onClick={() => setSearch("")} />}
                </div>
              </div>
            )}

            <table className={Style.pmtable}>
              <thead>
                <tr className={Style.pmtheadrow}>
                  <th className={Style.pmth}>Date</th>
                  <th className={Style.pmth}>Reference</th>
                  <th className={Style.pmth}>Method</th>
                  <th className={Style.pmth}>Vendors / Invoices</th>
                  <th className={Style.pmth}>Amount</th>
                  <th className={Style.pmth}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className={Style.pmemptyrow}><td colSpan={6}>Loading payment history…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr className={Style.pmemptyrow}><td colSpan={6}>No payments match your filter.</td></tr>
                ) : (
                  filtered
                    .slice()
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
                    .map((p) => (
                      <tr key={p.id} className={Style.pmrow}>
                        <td className={`${Style.pmtd} ${Style.pmtddate}`}>{p.date}</td>
                        <td className={`${Style.pmtd} ${Style.pmtdref}`}>{p.ref}</td>
                        <td className={Style.pmtd}>
                          <div className={Style.pmtdmethod}><MethodIcon method={p.method} /> {p.method}</div>
                        </td>
                        <td className={Style.pmtd}>
                          <div className={Style.pmtdvendor}>{p.vendor}</div>
                          <div className={Style.pmtdinvoice}>{p.invoice}</div>
                        </td>
                        <td className={`${Style.pmtd} ${Style.pmtdamount}`}>{currency(p.amount)}</td>
                        <td className={Style.pmtd}><StatusBadge status={p.status} /></td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <div className={`${Style.pmstatusbar} ${error ? Style.pmstatuserror : ""}`}>
            {saving ? "Saving changes…" : error ? error : "All changes are saved automatically to your workspace."}
          </div>
        </main>

  );
}
