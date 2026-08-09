import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, Filter, Download, MoreVertical, Check, Trash2, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import Style from './AR_Invoices.module.css'
import api from '../../../components/api'

const STORAGE_KEY = "flugur-ar:invoices";
const PAGE_SIZE = 5;

const S = {
    toast: (visible) => ({
        position: "fixed",
        bottom: 28,
        right: 28,
        background: "#111827",
        color: "#fff",
        padding: "13px 20px",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "0 4px 16px rgba(0,0,0,.25)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity .3s, transform .3s",
        zIndex: 9999,
    }),
};

function currency(n) {
    return n.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
function formatDate(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }) {
    const cls =
        status === "APPROVED" ? `${Style.arbadge} ${Style.arbadgeapproved}` :
            status === "PAID" ? `${Style.arbadge} ${Style.arbadgepaid}` :
                status === "PENDING" ? `${Style.arbadge} ${Style.arbadgepending}` :
                    `${Style.arbadge} ${Style.arbadgedraft}`;
    return <span className={cls}>{status.toUpperCase()}</span>;
}

export default function FlugurARDark() {
    const [invoices, setInvoices] = useState([]);
    const [CUSTOMERS, setCustomers] = useState([]);
    const [Periods, setPeriods] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState({ visible: false, msg: "" });
    const navigate = useNavigate();
    const [invDate, setInvDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [customer, setCustomer] = useState("");
    const [period, setperiod] = useState("");
    const [subtotal, setSubtotal] = useState("");
    const [paid, setPaid] = useState("");
    const [formStatus, setFormStatus] = useState("");

    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [page, setPage] = useState(1);
    const [menuOpenId, setMenuOpenId] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const res = await api.get("/ar_invoices");
                setInvoices(res.data.ar_invoices || res.data || []);
            } catch (err) {
                console.error(err);
                setInvoices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const res = await api.get("/customer");
                setCustomers(res.data.Customer || res.data || []);
            } catch (err) {
                console.error(err);
                setCustomers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                setLoading(true);
                const res = await api.get("/accper/acc_periods");
                setPeriods(res.data.account || res.data || []);
            } catch (err) {
                console.error(err);
                setPeriods([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPeriods();
    }, []);

    const persist = async (next) => {
        setInvoices(next);
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

    const nextInvNo = useMemo(() => {
        const nums = invoices.map((i) => parseInt(i.invoice_number.replace("AR-", ""), 10)).filter((n) => !isNaN(n));
        const max = nums.length ? Math.max(...nums) : 10487;
        return `AR-${max + 1}`;
    }, [invoices]);

    const subtotalNum = parseFloat(subtotal) || 0;
    const taxAmount = subtotalNum * 0.15;
    const totalAmount = subtotalNum + taxAmount;

    const discardForm = () => {
        setInvDate("");
        setDueDate("");
        setCustomer("");
        setSubtotal("");
        setFormStatus("");
    };

    const showToast = (msg) => {
        setToast({ visible: true, msg });
        setTimeout(() => setToast({ visible: false, msg: "" }), 3000);
    };

    const generateInvoice = async () => {

        try {
            if (!invDate || !customer || subtotalNum <= 0) return;
            const newInvoice = {
                invoice_date: invDate,
                due_date: dueDate,
                customer_id: customer,
                period_id: period,
                paid_amount: paid,
                total_amount: totalAmount,
                tax_amount: taxAmount,
                subtotal: subtotal,
                status: formStatus,
            };

            const res = await api.post("/ar_invoices/add", newInvoice);
            console.log(newInvoice);

            if (res.data?.invoices) {
                setInvoices((prev) => [res.data.invoices, ...prev]);
            }

            showToast("✓ Account Recievable Invoice created successfully!");
            discardForm();
            setPage(1);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.msg || "Failed to create Invoice";
            showToast(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const markPaid = async (id) => {
        try {
            const invoice = invoices.find((v) => v._id === id);
            if (!invoice) return;

            if (invoice.status === "PAID") {
                showToast("Invoice is already paid");
                return;
            }

            const newStatus = "PAID";

            await api.patch(`/ar_invoices/status/${id}`, { status: newStatus });

            setInvoices((prev) =>
                prev.map((v) =>
                    v._id === id ? { ...v, status: newStatus } : v
                )
            );

            showToast("✓ Invoice Paid successfully!");
        } catch (err) {
            console.error(err);
            showToast("Failed to update status");
        }
    };

    const approveInvoice = async (id) => {
        try {
            const invoice = invoices.find((v) => v._id === id);
            if (!invoice) return;

            if (invoice.status === "APPROVED") {
                showToast("Invoice is already Approved");
                return;
            }

            const newStatus = "APPROVED";

            await api.patch(`/ar_invoices/status/${id}`, { status: newStatus });

            setInvoices((prev) =>
                prev.map((v) =>
                    v._id === id ? { ...v, status: newStatus } : v
                )
            );

            showToast("✓ Invoice Approved successfully!");
        } catch (err) {
            console.error(err);
            showToast("Failed to update status");
        }
    };
    
    const deleteInvoice = async (id) => {
        try {
            const invoice = invoices.find((v) => v._id === id);
            if (!invoice) return;

            await api.delete(`/ar_invoices/${id}`);

            setInvoices((prev) => prev.filter((v) => v._id !== id));

            showToast("✓ Invoice deleted successfully!");
        } catch (err) {
            console.error(err);
            showToast("Failed to delete invoice");
        }
    };

    const exportCsv = () => {
        const header = ["Invoice Number", "Date", "Customer", "Tax", "Total Amount", "Status"];
        const rows = filtered.map((i) => [i.invoice_number, i.invoice_date, i.customer_id?.name, i.tax_amount, i.total_amount.toFixed(2), i.status]);
        const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ar-invoices.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const filtered = invoices.filter(
        (i) =>
            i.customer_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
            i.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
            i.status?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageSafe = Math.min(page, totalPages);
    const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

    return (
        <main className={Style.arcontent}>
            <div className={Style.arbreadcrumb}>
                <span>Invoices</span>
                <ChevronRight size={12} />
                <b>Accounts Receivable</b>
            </div>

            <div className={Style.arcard}>
                <div className={Style.arformhead}>
                    <div>
                        <h1 className={Style.arformtitle}>New Sales Invoice</h1>
                        <div className={Style.arformsub}>Generate a verified professional AR record</div>
                    </div>
                    <span className={Style.arautogenchip}>AUTO-GEN: {nextInvNo}</span>
                </div>

                <div className={Style.arformbody}>
                    <div>
                        <div className={Style.arformgrid}>
                            <div>
                                <label className={Style.arfieldlabel}>Invoice Date</label>
                                <input type="date" className={Style.arinput} value={invDate} onChange={(e) => setInvDate(e.target.value)} />
                            </div>
                            <div>
                                <label className={Style.arfieldlabel}>Due Date</label>
                                <input type="date" className={Style.arinput} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className={Style.arfieldlabel}>Customer Selection</label>
                            <div className={Style.arselectwrap}>
                                <select className={Style.arselect} value={customer} onChange={(e) => setCustomer(e.target.value)}>
                                    <option value="">Select Corporate Client</option>
                                    {CUSTOMERS.map((c) => <option key={c.name} value={c._id}>{c.name}</option>)}
                                </select>
                                <ChevronDown size={15} className={Style.arselectcaret} />
                            </div>
                        </div>

                        <div>
                            <br></br>
                            <div className={Style.arformgrid}>
                                <div>
                                    <label className={Style.arfieldlabel}>Account Period</label>
                                    <div className={Style.arselectwrap}>
                                        <select className={Style.arselect} value={period} onChange={(e) => setperiod(e.target.value)}>
                                            <option value="">Accounting Periods</option>
                                            {Periods.map((c) => <option key={c.name} value={c._id}>{c.name}</option>)}
                                        </select>
                                        <ChevronDown size={15} className={Style.arselectcaret} />
                                    </div>
                                </div>
                                <div>
                                    <label className={Style.arfieldlabel}>Paid Amount (USD)</label>
                                    <input type="number" step="0.01" className={Style.arinput} placeholder="0.00" value={paid} onChange={(e) => setPaid(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={Style.arsidefield}>
                            <label className={Style.arfieldlabel}>Subtotal (USD)</label>
                            <input
                                type="number"
                                step="0.01"
                                className={Style.arinput}
                                placeholder="0.00"
                                value={subtotal}
                                onChange={(e) => setSubtotal(e.target.value)}
                            />
                        </div>
                        <div className={Style.arsidefield}>
                            <label className={Style.arfieldlabel}>Tax Amount (15%)</label>
                            <div className={Style.arreadonlybox}>{currency(taxAmount)}</div>
                        </div>
                        <div>
                            <label className={Style.arfieldlabel}>Status</label>
                            <div className={Style.arselectwrap}>
                                <select className={Style.arselect} value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                                    <option value="">Select Status</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="DRAFT">DRAFT</option>
                                    <option value="PAID">PAID</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                                <ChevronDown size={15} className={Style.arselectcaret} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Style.arformdivider} />

                <div className={Style.arformactions}>
                    <button className={Style.arbtndiscard} onClick={discardForm}>DISCARD</button>
                    <button
                        className={Style.arbtngenerate}
                        disabled={saving || !invDate || !customer || subtotalNum <= 0}
                        onClick={generateInvoice}
                    >
                        {saving ? <Loader2 size={15} className={Style.arspin} /> : "GENERATE INVOICE"}
                    </button>
                </div>
            </div>

            <div className={Style.arcard}>
                <div className={Style.arhistoryhead}>
                    <div>
                        <h2 className={Style.arhistorytitle}>Sales Invoices History</h2>
                        <div className={Style.arhistorysub}>Manage lifecycle and reconciliation</div>
                    </div>
                    <div className={Style.arhistorytools}>
                        <button className={`${Style.arbtnghost} ${showFilter ? Style.arfilteron : ""}`} onClick={() => setShowFilter(!showFilter)}>
                            <Filter size={14} /> FILTER
                        </button>
                        <button className={Style.arbtnghost} onClick={exportCsv}>
                            <Download size={14} /> EXPORT CSV
                        </button>
                    </div>
                </div>

                {showFilter && (
                    <div className={Style.arfilterrow}>
                        <div className={Style.arfilterinputwrap}>
                            <input
                                className={Style.arfilterinput}
                                placeholder="Filter by invoice #, customer or status..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                <table className={Style.artable}>
                    <thead>
                        <tr className={Style.artheadrow}>
                            <th className={Style.arth}>Invoice Number</th>
                            <th className={Style.arth}>Date</th>
                            <th className={Style.arth}>Customer</th>
                            <th className={Style.arth}>Total Amount</th>
                            <th className={Style.arth}>Status</th>
                            <th className={Style.arth}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr className={Style.aremptyrow}><td colSpan={6}>Loading invoices…</td></tr>
                        ) : pageItems.length === 0 ? (
                            <tr className={Style.aremptyrow}><td colSpan={6}>No invoices match your filter.</td></tr>
                        ) : (
                            pageItems.map((i) => (
                                <tr key={i.id} className={Style.arrow}>
                                    <td className={`${Style.artd} ${Style.artdinvno}`}>{i.invoice_number}</td>
                                    <td className={`${Style.artd} ${Style.artddate}`}>{formatDate(i.invoice_date)}</td>
                                    <td className={Style.artd}>
                                        <div className={Style.artdcustomer}>{i.customer_id.name}</div>
                                    </td>
                                    <td className={`${Style.artd} ${Style.artdtotal}`}>{currency(i.total_amount)}</td>
                                    <td className={Style.artd}><StatusBadge status={i.status} /></td>
                                    <td className={Style.artd}>
                                        <div className={Style.arrowmenuwrap}>
                                            <MoreVertical size={16} className={Style.armenutrigger} onClick={() => setMenuOpenId(menuOpenId === i._id ? null : i._id)} />
                                            {menuOpenId === i._id && (
                                                <div className={Style.ardropdown}>
                                                    <button className={Style.ardropdownitem} onClick={() => navigate(`/Dashboard/AR_Receipts/${i._id}`)}>
                                                        <Plus size={14} /> Payment Receipt
                                                    </button>
                                                    {i.status !== "APPROVED" && (
                                                        <button className={Style.ardropdownitem} onClick={() => approveInvoice(i._id)}>
                                                            <Check size={14} /> Approve
                                                        </button>
                                                    )}
                                                    {i.status !== "PAID" && (
                                                        <button className={Style.ardropdownitem} onClick={() => markPaid(i._id)}>
                                                            <Check size={14} /> Mark as Paid
                                                        </button>
                                                    )}
                                                    <button className={`${Style.ardropdownitem} ${Style.ardanger}`} onClick={() => deleteInvoice(i._id)}>
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className={Style.arfooterrow}>
                    <div className={Style.arshowingtext}>
                        Showing {pageItems.length} of {filtered.length} invoices
                    </div>
                    <div className={Style.arpagination}>
                        <button className={Style.arpagebtn} disabled={pageSafe === 1} onClick={() => setPage(pageSafe - 1)}>‹</button>
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                            <button key={p} className={`${Style.arpagebtn} ${p === pageSafe ? Style.arpageactive : ""}`} onClick={() => setPage(p)}>{p}</button>
                        ))}
                        <button className={Style.arpagebtn} disabled={pageSafe === totalPages} onClick={() => setPage(pageSafe + 1)}>›</button>
                    </div>
                </div>
            </div>

            <div style={S.toast(toast.visible)} className="border border-success text-success">
                {toast.msg}
            </div>
        </main>
    );
}
