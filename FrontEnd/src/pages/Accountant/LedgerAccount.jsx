import { useState, useEffect } from "react";
import { ChevronDown, Filter, Download, MoreVertical, ChevronLeft, ChevronRight, Loader2, Lock, Unlock, Trash2, } from "lucide-react";
import Style from './LedgerAccount.module.css'
import api from '../../components/api'

const TYPE_CONFIG = {
    ASSET: { subtypes: ["current_asset", "long_term_liability"], prefix: "1", defaultBalance: "DEBIT", tag: Style.lptagasset },
    LIABILITY: { subtypes: ["current_asset", "long_term_liability"], prefix: "2", defaultBalance: "CREDIT", tag: Style.lptagliability },
    EQUITY: { subtypes: ["current_asset", "long_term_liability"], prefix: "3", defaultBalance: "CREDIT", tag: Style.lptagequity },
    REVENUE: { subtypes: ["current_asset", "long_term_liability"], prefix: "4", defaultBalance: "CREDIT", tag: Style.lptagrevenue },
    EXPENSE: { subtypes: ["current_asset", "long_term_liability"], prefix: "6", defaultBalance: "DEBIT", tag: Style.lptagexpense },
};

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

const PAGE_SIZE = 5;

function TypeTag({ type }) {
    return <span className={`${Style.lptag} ${TYPE_CONFIG[type]?.tag || ""}`}>{type.toUpperCase()}</span>;
}

function StatusDot({ status }) {
    return (
        <span className={`${Style.lpstatus} ${status === "ACTIVE" ? Style.lpstatusactive : Style.lpstatuslocked}`}>
            <span className={Style.lpstatusdot} /> {status}
        </span>
    );
}

export default function LedgerAccount() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState({ visible: false, msg: "" });
    const [name, setName] = useState("");
    const [type, setType] = useState("ASSET");
    const [subtype, setSubtype] = useState(TYPE_CONFIG["ASSET"].subtypes[0]);
    const [normalBalance, setNormalBalance] = useState("DEBIT");
    const [controlAccount, setControlAccount] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [menuOpenId, setMenuOpenId] = useState(null);

    const showToast = (msg) => {
        setToast({ visible: true, msg });
        setTimeout(() => setToast({ visible: false, msg: "" }), 3000);
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const res = await api.get("/gl/accounts");
                setAccounts(res.data.account || res.data || []);

            } catch (err) {
                console.error(err);
                setAccounts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);


    const onTypeChange = (t) => {
        setType(t);
        setSubtype(TYPE_CONFIG[t].subtypes[0]);
        setNormalBalance(TYPE_CONFIG[t].defaultBalance);
    };

    const clearForm = () => {
        setName("");
        setType("ASSET");
        setSubtype(TYPE_CONFIG["ASSET"].subtypes[0]);
        setNormalBalance("DEBIT");
        setControlAccount(false);
    };

    const saveAccount = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            showToast("Account name is required");
            return;
        }

        const newAccount = {
            name: name.trim(),
            type: type,
            subtype: subtype,
            normal_balance: normalBalance,
            is_control: "ACTIVE",
        };

        await persist(newAccount);
        clearForm();
        setPage(1);
    };

    const persist = async (newAccount) => {
        setSaving(true);

        try {
            const res = await api.post("/gl/add", newAccount);

            if (res.data?.data) {
                setAccounts((prev) => [res.data.data, ...prev]);
                setError("");
                showToast("✓ Account created successfully!");
            } else {
                setError("Save failed — unexpected response.");
                showToast("Failed to create account");
            }

        } catch (error) {
            console.error(error);
            setError("Save failed — changes may not persist.");
            const errorMsg = error.response?.data?.msg || "Failed to create Account";
            showToast(errorMsg);
        } finally {
            setSaving(false);
        }
    };

  const toggleLock = async (id) => {
    try {
      const account = accounts.find((v) => v._id === id);
      if (!account) return;

      const newStatus = account.is_control === "LOCKED" ? "ACTIVE" : "LOCKED";

      await api.patch(`/gl/status/${id}`, { is_control: newStatus });

      setAccounts((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, is_control: newStatus } : v
        )
      );
      showToast("✓ Account status updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status");
    }
  };

    const deleteAccount = async (id) => {
        await persist(accounts.filter((a) => a._id !== id));
        setMenuOpenId(null);
    };

    const exportCsv = () => {
        const header = ["Code", "Account Name", "Type", "Subtype", "Normal Balance", "Status", "Control Account"];
        const rows = filtered.map((a) => [a.code, a.name, a.type, a.subtype, a.balance, a.status, a.control ? "Yes" : "No"]);
        const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "chart-of-accounts.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const filtered = accounts.filter((v) =>
        (v?.name ?? "").toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageSafe = Math.min(page, totalPages);
    const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

    return (
        <div className={Style.lpcontent}>
            {/* ---------------- ADD NEW ACCOUNT ---------------- */}
            <div className={Style.lpformsection}>
                <h1 className={Style.lpsectiontitle}>Add New Account</h1>
                <div className={Style.lpsectionsub}>Configure a new general ledger identity.</div>

                <form onSubmit={saveAccount}>
                    <div className={Style.lpformgrid}>
                        <div>
                            <label className={Style.lpfieldlabel}>Account Name</label>
                            <input className={Style.lpinput} placeholder="e.g. Operating Cash" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label className={Style.lpfieldlabel}>Account Type</label>
                            <div className={Style.lpselectwrap}>
                                <select className={Style.lpselect} value={type} onChange={(e) => onTypeChange(e.target.value)}>
                                    {Object.keys(TYPE_CONFIG).map((t) => <option key={t}>{t}</option>)}
                                </select>
                                <ChevronDown size={14} className={Style.lpselectcaret} />
                            </div>
                        </div>
                        <div>
                            <label className={Style.lpfieldlabel}>Subtype</label>
                            <div className={Style.lpselectwrap}>
                                <select className={Style.lpselect} value={subtype} onChange={(e) => setSubtype(e.target.value)}>
                                    {TYPE_CONFIG[type].subtypes.map((s) => <option key={s}>{s}</option>)}
                                </select>
                                <ChevronDown size={14} className={Style.lpselectcaret} />
                            </div>
                        </div>
                        <div>
                            <label className={Style.lpfieldlabel}>Normal Balance</label>
                            <div className={Style.lpbalancetoggle}>
                                <button
                                    type="button"
                                    className={`${Style.lpbalancebtn} ${normalBalance === "DEBIT" ? Style.lpbalanceselected : ""}`}
                                    onClick={() => setNormalBalance("DEBIT")}
                                >
                                    DEBIT
                                </button>
                                <button
                                    type="button"
                                    className={`${Style.lpbalancebtn} ${normalBalance === "CREDIT" ? Style.lpbalanceselected : ""}`}
                                    onClick={() => setNormalBalance("CREDIT")}
                                >
                                    CREDIT
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={Style.lpcontrolrow}>
                        <div className={Style.lpcontrolleft}>
                            <div className={`${Style.lpswitch} ${controlAccount ? Style.lpswitchon : ""}`} onClick={() => setControlAccount(!controlAccount)}>
                                <div className={Style.lpswitchknob} />
                            </div>
                            <div>
                                <div className={Style.lpcontroltitle}>Control Account</div>
                                <div className={Style.lpcontrolsub}>Summarizes sub-ledger activity</div>
                            </div>
                        </div>
                        <div className={Style.lpcontrolactions}>
                            <button type="submit" className={Style.lpbtnsave} disabled={saving || !name.trim()}>
                                {saving ? <Loader2 size={14} className={Style.lpspin} /> : "Save Account"}
                            </button>
                            <button type="button" className={Style.lpbtnclear} onClick={clearForm}>Clear</button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ---------------- RETRIEVE ACCOUNTS ---------------- */}
            <div className={Style.lpretrievehead}>
                <div>
                    <h2 className={Style.lpretrievetitle}>Retrieve Accounts</h2>
                    <div className={Style.lpbreadcrumb}>Ledger &gt; <b>Accounts</b></div>
                </div>
                <div className={Style.lpretrievetools}>
                    <div className={Style.lpfilterwrap}>
                        <Filter size={14} className={Style.lpfiltericon} />
                        <input
                            className={Style.lpfilterinput}
                            placeholder="Filter by Name or Type..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <button className={Style.lpexportbtn} onClick={exportCsv}>
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            <div className={Style.lptablecard}>
                <table className={Style.lptable}>
                    <thead>
                        <tr className={Style.lptheadrow}>
                            <th className={Style.lpth}>Code</th>
                            <th className={Style.lpth}>Account Name</th>
                            <th className={Style.lpth}>Type</th>
                            <th className={Style.lpth}>Balance</th>
                            <th className={Style.lpth}>Status</th>
                            <th className={Style.lpth}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr className={Style.lpemptyrow}><td colSpan={6}>Loading chart of accounts…</td></tr>
                        ) : pageItems.length === 0 ? (
                            <tr className={Style.lpemptyrow}><td colSpan={6}>No accounts match your filter.</td></tr>
                        ) : (
                            pageItems.map((a) => (
                                <tr key={a.id} className={Style.lprow}>
                                    <td className={`${Style.lptd} ${Style.lptdcode}`}>{a.Account_number}</td>
                                    <td className={`${Style.lptd} ${Style.lptdname}`}>{a.name}</td>
                                    <td className={Style.lptd}><TypeTag type={a.type} /></td>
                                    <td className={`${Style.lptd} ${Style.lptdbalance}`}>{a.normal_balance}</td>
                                    <td className={Style.lpth}><StatusDot status={a.is_control} /></td>
                                    <td className={Style.lpth}>
                                        <div className={Style.lprowmenuwrap}>
                                            <MoreVertical size={16} className={Style.lpmenutrigger} onClick={() => setMenuOpenId(menuOpenId === a._id ? null : a._id)} />
                                            {menuOpenId === a._id && (
                                                <div className={Style.lpdropdown}>
                                                    <button className={Style.lpdropdownitem} onClick={() => toggleLock(a._id)}>
                                                        {a.is_control === "ACTIVE" ? <Lock size={14} /> : <Unlock size={14} />}
                                                        {a.is_control === "ACTIVE" ? "Lock Account" : "Unlock Account"}
                                                    </button>
                                                    <button className={`${Style.lpdropdownitem} ${Style.lpdanger}`} onClick={() => deleteAccount(a.id)}>
                                                        <Trash2 size={14} /> Delete Account
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

                <div className={Style.lpfooterrow}>
                    <div className={Style.lpshowingtext}>
                        Showing {pageItems.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}-{(pageSafe - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} accounts
                    </div>
                    <div className={Style.lppagination}>
                        <button className={Style.lppagebtn} disabled={pageSafe === 1} onClick={() => setPage(pageSafe - 1)}>
                            <ChevronLeft size={15} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button key={p} className={`${Style.lppagebtn}  ${p === pageSafe ? Style.lppageactive : ""}`} onClick={() => setPage(p)}>
                                {p}
                            </button>
                        ))}
                        <button className={Style.lppagebtn} disabled={pageSafe === totalPages} onClick={() => setPage(pageSafe + 1)}>
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
            <div className={`${Style.lpstatusbar} ${error ? Style.lpstatuserror : ""}`}>
                {saving ? "Saving changes…" : error ? error : "All changes are saved automatically to your workspace."}
            </div>
            <div style={S.toast(toast.visible)} className="border border-success text-success">
                {toast.msg}
            </div>
        </div>
    );
}
