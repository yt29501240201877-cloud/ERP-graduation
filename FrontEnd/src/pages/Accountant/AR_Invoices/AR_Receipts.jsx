import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Landmark, Search, ChevronDown, PlusCircle, History, Download, CheckCircle2, Circle, CreditCard, Banknote, Globe, Loader2 } from "lucide-react";
import Style from './AR_Receipts.module.css'
import api from '../../../components/api'

const METHODS = [
    { key: "Bank", label: "Bank", icon: Landmark },
    { key: "Cash", label: "Cash", icon: Banknote },
    { key: "Card", label: "Card", icon: CreditCard },
    { key: "Online", label: "Online", icon: Globe },
];

const STORAGE_KEY = "flugur-ar:receipts";
const PAGE_SIZE = 4;

function initials(name) {
    return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function currency(n) {
    return n.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
function formatDate(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ManageReceiptsDark() {
    const [receipts, setReceipts] = useState([]);
        // const [Data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [date, setDate] = useState("2023-11-20");
    const [amount, setAmount] = useState("");
    const [customers, setCustomers] = useState([]);
    const [invoiceRef, setInvoiceRef] = useState("");
    const [method, setMethod] = useState("Bank");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [invoices, setInvoices] = useState(null);

    const { id } = useParams();

    // useEffect(() => {
    //     const fetchCustomers = async () => {
    //         try {
    //             setLoading(true);
    //             const res = await api.get("/customer");
    //             setCustomers(res.data.Customer || res.data || []);
    //             console.log(res.data.Customer);

    //         } catch (err) {
    //             console.error(err);
    //             setCustomers([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchCustomers();
    // }, []);

    useEffect(() => {
        const getInvoices = async () => {
            try {
                const res = await api.get(`/ar_receipts/${id}`);
                setInvoices(res.data);
                console.log(res.data);
                
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) getInvoices();
    }, [id]);

    const persist = async (next) => {
        setReceipts(next);
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

    const amountNum = parseFloat(amount) || 0;

    const clearForm = () => {
        setDate("2023-11-20");
        setAmount("");
        setCustomers("");
        setInvoiceRef("");
        setMethod("Bank");
    };

    const recordReceipt = async () => {
        if (!date || amountNum <= 0 || !customers) return;
        const seq = 900 + receipts.length + Math.floor(Math.random() * 20);
        const newReceipt = {
            id: `rc${Date.now()}`,
            date,
            customers,
            ref: `REC-00${seq}-${initials(customers)}`,
            method,
            amount: amountNum,
            status: method === "Online" || method === "Cash" ? "Pending" : "Cleared",
        };
        await persist([newReceipt, ...receipts]);
        clearForm();
        setPage(1);
    };

    const toggleStatus = async (id) => {
        await persist(receipts.map((r) => (r.id === id ? { ...r, status: r.status === "Cleared" ? "Pending" : "Cleared" } : r)));
    };

    const exportCsv = () => {
        const header = ["Date", "Customer", "Reference", "Method", "Amount", "Status"];
        const rows = filtered.map((r) => [r.date, r.customer, r.ref, r.method, r.amount.toFixed(2), r.status]);
        const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "receipt-history.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const filtered = invoices.filter(
        (r) =>
            r.invoice_number.toLowerCase().includes(search.toLowerCase()) 
            // r.ref?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageSafe = Math.min(page, totalPages);
    const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

    return (
        <main className={Style.rccontent}>
            <div className={Style.rcbreadcrumb}>ACCOUNTS RECEIVABLE / <b>RECEIPTS</b></div>

            <div className={Style.rcpagehead}>
                <h1 className={Style.rcpagetitle}>Manage Receipts</h1>
                <button className={Style.rcbtnghost} onClick={exportCsv}>
                    <Download size={15} /> EXPORT DATA
                </button>
            </div>

            {/* Record New Receipt */}
            <div className={Style.rccard}>
                <div className={Style.rccardhead}>
                    <PlusCircle size={18} className={Style.rccardicon} />
                    <span className={Style.rccardtitle}>Record New Receipt</span>
                </div>

                <div className={Style.rcformgrid}>
                    <div className={Style.rcfield} style={{ marginBottom: 0 }}>
                        <label className={Style.rcfieldlabel}>Receipt Date</label>
                        <input type="date" className={Style.rcinput} value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className={Style.rcfield} style={{ marginBottom: 0 }}>
                        <label className={Style.rcfieldlabel}>Amount</label>
                        <div className={Style.rcamountwrap}>
                            <span className={Style.rcamountsymbol}>$</span>
                            <input type="number" step="0.01" className={Style.rcinput} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                    </div>
                    <div className={Style.rcfield} style={{ marginBottom: 0 }}>
                        <label className={Style.rcfieldlabel}>Payment Method</label>
                        <div className={Style.rcmethodgrid}>
                            {METHODS.map((m) => (
                                <button
                                    key={m.key}
                                    type="button"
                                    className={`${Style.rcmethodbtn} ${method === m.key ? Style.rcmethodselected : ""}`}
                                    onClick={() => setMethod(m.key)}
                                >
                                    <m.icon size={14} /> {m.label.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={Style.rcformgrid}>
                    <div className={Style.rcfield}>
                        <label className={Style.rcfieldlabel}>Customer Selection</label>
                        <div className={Style.rcselectwrap}>
                            <select className={Style.rcselect} value={customers} onChange={(e) => setCustomers(e.target.value)}>
                                <option value="">Select customer</option>
                                {customers.map((c) => <option key={c._id}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={15} className={Style.rcselectcaret} />
                        </div>
                    </div>
                    <div className={Style.rcfield}>
                        <label className={Style.rcfieldlabel}>Invoice Reference</label>
                        <input className={Style.rcinput} placeholder="e.g. INV-2023-0045" value={invoiceRef} onChange={(e) => setInvoiceRef(e.target.value)} disabled />
                    </div>
                    <div className={Style.rcfield}>
                        <label className={Style.rcfieldlabel}>Unapplied Amount</label>
                        <div className={Style.rcreadonlybox}>{currency(amountNum)}</div>
                    </div>
                </div>

                <div className={Style.rcformdivider} />

                <div className={Style.rcformactions}>
                    <button className={Style.rcbtnclear} onClick={clearForm}>CLEAR FORM</button>
                    <button className={Style.rcbtnrecord} disabled={saving || !date || amountNum <= 0 || !customers} onClick={recordReceipt}>
                        {saving ? <Loader2 size={15} className={Style.rcspin} /> : "RECORD RECEIPT"}
                    </button>
                </div>
            </div>

            {/* Receipt History */}
            <div className={Style.rccard}>
                <div className={Style.rccardhead} style={{ justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <History size={18} className={Style.rccardicon} />
                        <span className={Style.rccardtitle}>Receipt History</span>
                    </div>
                    <div className={Style.rchistorysearch}>
                        <Search size={14} className={Style.rchistorysearchicon} />
                        <input
                            className={Style.rchistorysearchinput}
                            placeholder="Search customer or ref..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                <table className={Style.rctable}>
                    <thead>
                        <tr className={Style.rctheadrow}>
                            <th className={Style.rcth}>Date</th>
                            <th className={Style.rcth}>Customer</th>
                            <th className={Style.rcth}>Reference</th>
                            <th className={Style.rcth}>Method</th>
                            <th className={Style.rcth} style={{ textAlign: "right" }}>Amount</th>
                            <th className={Style.rcth} style={{ textAlign: "center" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr className={Style.rcempty}><td colSpan={6}>Loading receipts…</td></tr>
                        ) : pageItems.length === 0 ? (
                            <tr className={Style.rcempty}><td colSpan={6}>No receipts match your search.</td></tr>
                        ) : (
                            pageItems.map((r) => (
                                <tr key={r._id} className={Style.rcrow}>
                                    <td className={`${Style.rctd} ${Style.rctddate}`}>{formatDate(r.date)}</td>
                                    <td className={Style.rctd}>
                                        <div className={Style.rctdcustomercell}>
                                            <div className={Style.rcavatarsm}>{initials(r.customer)}</div>
                                            <span className={Style.rccustomername}>{r.customer}</span>
                                        </div>
                                    </td>
                                    <td className={`${Style.rctd} ${Style.rctdref}`}>{r.ref}</td>
                                    <td className={Style.rctd}><span className={Style.rcmethodtag}>{r.method.toUpperCase()}</span></td>
                                    <td className={`${Style.rctd} ${Style.rctdamount}`}>{currency(r.amount)}</td>
                                    <td className={`${Style.rctd} ${Style.rctdstatus}`} onClick={() => toggleStatus(r.id)} title="Toggle status">
                                        {r.status === "Cleared" ? (
                                            <CheckCircle2 size={17} className={Style.rcstatuscleared} style={{ display: "inline" }} />
                                        ) : (
                                            <Circle size={17} className={Style.rcstatuspending} style={{ display: "inline" }} />
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className={Style.rcfooterrow}>
                    <div className={Style.rcshowingtext}>
                        Showing {pageItems.length} of {filtered.length} receipts
                    </div>
                    <div className={Style.rcpagination}>
                        <button className={Style.rcpagebtn} disabled={pageSafe === 1} onClick={() => setPage(pageSafe - 1)}>‹</button>
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                            <button key={p} className={`${Style.rcpagebtn} ${p === pageSafe ? Style.rcpageactive : ""}`} onClick={() => setPage(p)}>{p}</button>
                        ))}
                        <button className={Style.rcpagebtn} disabled={pageSafe === totalPages} onClick={() => setPage(pageSafe + 1)}>›</button>
                    </div>
                </div>
            </div>

            <div className={`${Style.rcstatusbar} ${error ? Style.rcstatuserror : ""}`}>
                {saving ? "Saving changes…" : error ? error : "All changes are saved automatically to your workspace."}
            </div>
        </main>
        //     </div>
        // </div>
    );
}
