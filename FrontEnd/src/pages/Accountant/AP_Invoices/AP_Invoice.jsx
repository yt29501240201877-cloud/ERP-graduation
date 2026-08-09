import { useState, useEffect, useMemo } from "react";
import { Download, Plus, MoreVertical, ChevronLeft, ChevronRight, Filter, ArrowUpDown, Loader2, TrendingUp, X, Check, Trash2 } from "lucide-react";
import Style from './AP_Invoice.module.css'
import api from '../../../components/api'
import { useNavigate } from "react-router-dom";


const STORAGE_KEY = "invoices:records";
const PAGE_SIZE = 5;
const TODAY_REF = new Date("2023-10-30");

function currency(n) {
    return n.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
function formatDate(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function daysBetween(a, b) {
    return Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));
}

function StatusBadge({ status }) {
    const cls =
        status === "PAID" ? `${Style.ivbadge} ${Style.ivbadgepaid}` : status === "PENDING" ?  `${Style.ivbadge} ${Style.ivbadgepending}` : status === "APPROVED" ? `${Style.ivbadge} ${Style.ivbadgeapproved}` : `${Style.ivbadge} ${Style.ivbadgedraft}`
    return <span className={cls}>{status.toUpperCase()}</span>;
}

export default function AP_Invoice() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [tab, setTab] = useState("All Invoices");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState("date");
    const [sortDir, setSortDir] = useState("desc");
    const [showForm, setShowForm] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null);

    const [vendor, setVendor] = useState("");
    const [vendorId, setVendorId] = useState("");
    const [invDate, setInvDate] = useState("2023-10-30");
    const [dueDate, setDueDate] = useState("2023-11-29");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("Draft");

    useEffect(() => {
        const getInvoices = async () => {
            try {
                const res = await api.get("/ap_invoices");
                setInvoices(res.data.ap_invoices);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        getInvoices();
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

    const resetForm = () => {
        setVendor("");
        setVendorId("");
        setInvDate("2023-10-30");
        setDueDate("2023-11-29");
        setAmount("");
        setStatus("Draft");
    };

    const createInvoice = async (e) => {
        e.preventDefault();
        const amt = parseFloat(amount);
        if (!vendor.trim() || !amt || amt <= 0) return;
        const seq = 1000 + invoices.length + Math.floor(Math.random() * 20);
        const initials = vendor
            .trim()
            .split(/\s+/)
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
        const newInvoice = {
            id: `i${Date.now()}`,
            invNo: `INV-2023-${seq}`,
            vendor: vendor.trim(),
            vendorId: vendorId.trim() || `V-${Math.floor(1000 + Math.random() * 9000)}`,
            initials: initials || "NA",
            date: invDate,
            due: dueDate,
            amount: amt,
            status,
        };
        await persist([newInvoice, ...invoices]);
        resetForm();
        setShowForm(false);
        setPage(1);
    };

    const markPaid = async (id) => {
        await persist(invoices.map((inv) => (inv.id === id ? { ...inv, status: "Paid" } : inv)));
        setMenuOpenId(null);
    };
    const deleteInvoice = async (id) => {
        await persist(invoices.filter((inv) => inv.id !== id));
        setMenuOpenId(null);
    };

    const exportCsv = () => {
        const header = ["Invoice #", "Vendor", "Vendor ID", "Date", "Due", "Amount", "Status"];
        const rows = filteredAll.map((inv) => [inv.invNo, inv.vendor, inv.vendorId, inv.date, inv.due, inv.amount.toFixed(2), inv.status]);
        const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "invoices.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const filteredAll = useMemo(() => {
        let list = invoices.filter(
            (inv) =>
                inv.invoice_number.toLowerCase().includes(search.toLowerCase())
        );
        if (tab === "Pending") list = list.filter((i) => i.status === "Pending");
        if (tab === "Paid") list = list.filter((i) => i.status === "Paid");
        list = [...list].sort((a, b) => {
            let v = 0;
            if (sortKey === "date") v = new Date(a.date) - new Date(b.date);
            if (sortKey === "amount") v = a.amount - b.amount;
            return sortDir === "asc" ? v : -v;
        });
        return list;
    }, [invoices, search, tab, sortKey, sortDir]);


    const totalPages = Math.max(1, Math.ceil(filteredAll.length / PAGE_SIZE));
    const pageSafe = Math.min(page, totalPages);
    const pageItems = filteredAll.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

    const totalOutstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
    const pendingList = invoices.filter((i) => i.status === "Pending");
    const pendingValue = pendingList.reduce((s, i) => s + i.amount, 0);
    const dueThisWeek = invoices.filter((i) => i.status !== "Paid" && daysBetween(TODAY_REF, i.due) >= 0 && daysBetween(TODAY_REF, i.due) <= 7);
    const avgCycle =
        invoices.length > 0
            ? (invoices.reduce((s, i) => s + daysBetween(i.date, i.due), 0) / invoices.length).toFixed(1)
            : "0.0";
    const dueBarPct = Math.min(100, Math.round((dueThisWeek.length / Math.max(1, pendingList.length + dueThisWeek.length)) * 100));

    return (
        <main className={Style.ivcontent}>
            <div className={Style.ivpagehead}>
                <div>
                    <h1 className={Style.ivpagetitle}>Invoices</h1>
                    <p className={Style.ivpagesub}>Manage vendor billing and payment processing cycles.</p>
                </div>
                <div className={Style.ivheadactions}>
                    <button className={Style.ivbtnghost} onClick={exportCsv}>
                        <Download size={15} /> EXPORT CSV
                    </button>
                    <button className={Style.ivbtnsolid} onClick={() => setShowForm(!showForm)}>
                        <Plus size={15} /> NEW INVOICE
                    </button>
                </div>
            </div>

            {/* Stat cards */}
            <div className={Style.ivstatsgrid}>
                <div className={Style.ivstatcard}>
                    <div className={Style.ivstatlabel}>Total Outstanding</div>
                    <div className={Style.ivstatvalue}>{currency(totalOutstanding)}</div>
                    <div className={Style.ivstattrend}><TrendingUp size={13} /> 12% vs last month</div>
                </div>
                <div className={Style.ivstatcard}>
                    <div className={Style.ivstatlabel}>Pending Approval</div>
                    <div className={Style.ivstatvalue}>{pendingList.length}</div>
                    <div className={Style.ivstattrend}>Valued at {currency(pendingValue)}</div>
                </div>
                <div className={Style.ivstatcard}>
                    <div className={Style.ivstatlabel}>Due This Week</div>
                    <div className={Style.ivstatvalue}>{dueThisWeek.length}</div>
                    <div className={Style.ivprogresstrack}><div className={Style.ivprogressfill} style={{ width: `${dueBarPct}%` }} /></div>
                </div>
                <div className={Style.ivstatcard}>
                    <div className={Style.ivstatlabel}>Average Pay Cycle</div>
                    <div className={Style.ivstatvalue}>{avgCycle} DAYS</div>
                    <div className={Style.ivstatnote}>Target: 15.0 days</div>
                </div>
            </div>

            {/* New invoice form */}
            {showForm && (
                <div className={Style.ivformcard}>
                    <div className={Style.ivformhead}>
                        <span className={Style.ivformtitle}>New Invoice</span>
                        <X size={18} className={Style.ivformclose} onClick={() => setShowForm(false)} />
                    </div>
                    <form onSubmit={createInvoice}>
                        <div className={Style.ivformgrid}>
                            <div>
                                <label className={Style.ivfieldlabel}>Vendor Name</label>
                                <input className={Style.ivinput} placeholder="e.g. Nexus Logistics" value={vendor} onChange={(e) => setVendor(e.target.value)} />
                            </div>
                            <div>
                                <label className={Style.ivfieldlabel}>Vendor ID</label>
                                <input className={Style.ivinput} placeholder="V-0000 (auto if blank)" value={vendorId} onChange={(e) => setVendorId(e.target.value)} />
                            </div>
                            <div>
                                <label className={Style.ivfieldlabel}>Amount</label>
                                <input type="number" step="0.01" className={Style.ivinput} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                            </div>
                        </div>
                        <div className={Style.ivformgrid}>
                            <div>
                                <label className={Style.ivfieldlabel}>Invoice Date</label>
                                <input type="date" className={Style.ivinput} value={invDate} onChange={(e) => setInvDate(e.target.value)} />
                            </div>
                            <div>
                                <label className={Style.ivfieldlabel}>Due Date</label>
                                <input type="date" className={Style.ivinput} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                            </div>
                            <div>
                                <label className={Style.ivfieldlabel}>Status</label>
                                <select className={Style.ivinput} value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option>Draft</option>
                                    <option>Pending</option>
                                    <option>Paid</option>
                                </select>
                            </div>
                        </div>
                        <div className={Style.ivformactions}>
                            <button type="button" className={Style.ivbtncancel} onClick={() => { resetForm(); setShowForm(false); }}>Cancel</button>
                            <button type="submit" className={Style.ivbtnsave} disabled={saving || !vendor.trim() || !amount}>
                                {saving ? <Loader2 size={14} className={Style.ivspin} /> : "Create Invoice"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className={Style.ivtablecard}>
                <div className={Style.ivtabsrow}>
                    <div className={Style.ivtabs}>
                        {["All Invoices", "Pending", "Paid"].map((t) => (
                            <button key={t} className={`${Style.ivtab} ${tab === t ? Style.ivtabactive : ""}`} onClick={() => { setTab(t); setPage(1); }}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className={Style.ivtabletools}>
                        <div
                            className={`${Style.ivtoolbtn} ${sortKey === "date" ? Style.ivtoolactive : ""}`}
                            onClick={() => { setSortKey("date"); setSortDir(sortKey === "date" && sortDir === "desc" ? "asc" : "desc"); }}
                            title="Sort by date"
                        >
                            <Filter size={15} />
                        </div>
                        <div
                            className={`${Style.ivtoolbtn} ${sortKey === "amount" ? Style.ivtoolactive : ""}`}
                            onClick={() => { setSortKey("amount"); setSortDir(sortKey === "amount" && sortDir === "desc" ? "asc" : "desc"); }}
                            title="Sort by amount"
                        >
                            <ArrowUpDown size={15} />
                        </div>
                    </div>
                </div>

                <table className={Style.ivtable}>
                    <thead>
                        <tr className={Style.ivtheadrow}>
                            <th className={Style.ivth}>Invoice #</th>
                            <th className={Style.ivth}>Vendor</th>
                            <th className={Style.ivth}>Date</th>
                            <th className={Style.ivth}>Due</th>
                            <th className={Style.ivth}>Amount</th>
                            <th className={Style.ivth}>Status</th>
                            <th className={Style.ivth}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr className={Style.ivemptyrow}><td colSpan={7}>Loading invoices…</td></tr>
                        ) : pageItems.length === 0 ? (
                            <tr className={Style.ivemptyrow}><td colSpan={7}>No invoices match this view.</td></tr>
                        ) : (
                            pageItems.map((inv) => (
                                <tr key={inv._id} className={Style.ivrow}>
                                    <td className={`${Style.ivtd} ${Style.ivtdinvno}`}>{inv.invoice_number}</td>
                                    <td className={Style.ivtd}>
                                        <div className={Style.ivtdvendorcell}>
                                            {/* <div className={Style.ivavatarchipsm}>{inv.initials}</div> */}
                                            <div>
                                                <div className={Style.ivvendorname}>{inv.vendor_id?.name}</div>
                                                <div className={Style.ivvendorid}>Vendor ID: {inv.vendor_id?.Vendor_number}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`${Style.ivtd} ${Style.ivtddate}`}>{formatDate(inv.invoice_date)}</td>
                                    <td className={`${Style.ivtd} ${Style.ivtddate}`}>{formatDate(inv.due_date)}</td>
                                    <td className={`${Style.ivtd} ${Style.ivtdamount}`}>{currency(inv.total_amount)}</td>
                                    <td className={Style.ivtd}><StatusBadge status={inv.status} /></td>
                                    <td className={Style.ivtd}>
                                        <div className={Style.ivrowmenuwrap}>
                                            <MoreVertical size={16} className={Style.ivmenutrigger} onClick={() => setMenuOpenId(menuOpenId === inv._id ? null : inv._id)} />
                                            {menuOpenId === inv._id && (
                                                <div className={Style.ivdropdown}>
                                                    <button className={Style.ivdropdownitem} onClick={() => navigate(`/Dashboard/AP_Lines/${inv._id}`)}>
                                                        <Plus size={14} /> Add Items
                                                    </button>
                                                    {inv.status !== "Paid" && (
                                                        <button className={Style.ivdropdownitem} onClick={() => markPaid(inv._id)}>
                                                            <Check size={14} /> Mark as Paid
                                                        </button>
                                                    )}
                                                    <button className={`${Style.ivdropdownitem} ${Style.ivdanger}`} onClick={() => deleteInvoice(inv._id)}>
                                                        <Trash2 size={14} /> Delete Invoice
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

                <div className={Style.ivfooterrow}>
                    <div className={Style.ivshowingtext}>
                        Showing {pageItems.length} of {filteredAll.length} results
                    </div>
                    <div className={Style.ivpagination}>
                        <button className={Style.ivpagebtn} disabled={pageSafe === 1} onClick={() => setPage(pageSafe - 1)}>
                            <ChevronLeft size={15} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button key={p} className={`${Style.ivpagebtn} ${p === pageSafe ? Style.ivpageactive : ""}`} onClick={() => setPage(p)}>
                                {p}
                            </button>
                        ))}
                        <button className={Style.ivpagebtn} disabled={pageSafe === totalPages} onClick={() => setPage(pageSafe + 1)}>
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${Style.ivstatusbar} ${error ? Style.ivstatuserror : ""}`}>
                {saving ? "Saving changes…" : error ? error : "All changes are saved automatically to your workspace."}
            </div>
        </main>
    )
}
