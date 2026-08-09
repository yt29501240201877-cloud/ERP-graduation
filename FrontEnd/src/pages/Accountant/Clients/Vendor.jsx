import { useState, useEffect } from "react";
import { Download, Printer, Filter, MoreVertical, Pencil, Ban, Check, X, ChevronDown, Loader2 } from "lucide-react";
import Style from './Vendor.module.css';
import api from '../../../components/api';

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

const PAGE_SIZE = 8;

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: "" });
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: "", taxId: "" });

  const [vendorName, setVendorName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [credit, setCredit] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [initialStatus, setInitialStatus] = useState("ACTIVE");
  const [subscribeAlerts, setSubscribeAlerts] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const res = await api.get("/vendor");
        setVendors(res.data.vendor || res.data || []);

      } catch (err) {
        console.error(err);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const showToast = (msg) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: "" }), 3000);
  };

  function StatusBadge({ status }) {
    const cls =
      `${Style.vmbadge} ${status === "ACTIVE" ? Style.vmbadgeactive : status === "BLOCKED" ? Style.vmbadgeblocked : Style.vmbadgeinactive}`;
    return (
      <span className={cls}>
        <span className={Style.vmbadgedot} />
        {status}
      </span>
    );
  }

  const saveEdit = async (id) => {
    const next = vendors.map((v) =>
      v.id === id ? { ...v, name: editDraft.name, taxId: editDraft.taxId } : v
    );
    setEditingId(null);
  };

  const startEdit = (v) => {
    setEditingId(v.id);
    setEditDraft({ name: v.name, taxId: v.taxId });
  };

  const resetForm = () => {
    setVendorName("");
    setTaxId("");
    setCredit("");
    setPaymentTerms("");
    setInitialStatus("ACTIVE");
    setSubscribeAlerts(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorName.trim() || !taxId.trim()) {
      showToast("Vendor Name and Tax ID are required");
      return;
    }

    setSaving(true);

    try {
      const vendorData = {
        name: vendorName.trim(),
        tax_id: taxId.trim(),
        credit_limit: credit.trim() || 0,
        payment_terms: paymentTerms || "NET30",
        status: initialStatus,
      };

      const res = await api.post("/vendor/add", vendorData);

      if (res.data?.vendor) {
        setVendors((prev) => [res.data.vendor, ...prev]);
      }

      showToast("✓ Vendor created successfully!");
      resetForm();

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.msg || "Failed to create vendor";
      showToast(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const toggleBlock = async (id) => {
    try {
      const vendor = vendors.find((v) => v._id === id);
      if (!vendor) return;

      const newStatus = vendor.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";

      await api.patch(`/vendor/status/${id}`, { status: newStatus });

      setVendors((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, status: newStatus } : v
        )
      );

      showToast("✓ Vendor status updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status");
    }
  };

  const exportCsv = () => {
    const header = ["Vendor ID", "Name", "Tax ID", "Status", "Payment Terms", "Credit Limits"];
    const rows = filtered.map((v) => [v.Vendor_number, v.name, v.tax_id, v.status, v.payment_terms, v.credit_limit]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendor-registry.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filtered = vendors.filter((v) =>
    (v?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  return (
    <>
      <main className={Style.vmcontent}>
        <div className={Style.vmpagehead}>
          <div>
            <h1 className={Style.vmpagetitle}>Vendor Management</h1>
            <p className={Style.vmpagesub}>
              Configure supply chain partners and financial disbursement terms.
            </p>
          </div>
          <div className={Style.vmheadactions}>
            <button className={Style.vmbtnghost} onClick={() => { exportCsv() }}>
              <Download size={15} /> Export CSV
            </button>
            <button className={Style.vmbtnsolid} onClick={() => window.print()}>
              <Printer size={15} /> Print Registry
            </button>
          </div>
        </div>

        <div className={Style.vmlayout}>
          <div className={Style.vmformcard}>
            <h2 className={Style.vmformtitle}>New Vendor</h2>
            <div className={Style.vmformsub}>Primary details for account creation.</div>
            <div className={Style.vmformrule} />

            <form onSubmit={handleSubmit} noValidate>
              <div className={Style.vmfield}>
                <label htmlFor="vendorName" className={Style.vmfieldlabel}>
                  Vendor Name <span className={Style.vmrequired}>*</span>
                </label>
                <input id="vendorName" type="text" className={Style.vminput} className={Style.vminput} placeholder="e.g. Global Logistics Inc."
                  value={vendorName} onChange={(e) => setVendorName(e.target.value)} required />
              </div>

              <div className={Style.vmfield}>
                <label htmlFor="taxId" className={Style.vmfieldlabel}>
                  Tax Identification Number (TIN) <span className={Style.vmrequired}>*</span>
                </label>
                <input id="taxId" type="text" className={Style.vminput} placeholder="XX-XXXXXXX" value={taxId} onChange={(e) => setTaxId(e.target.value)} required />
              </div>

              <div className={Style.vmfield}>
                <label htmlFor="credit" className={Style.vmfieldlabel}>
                  Credit Limit
                </label>
                <input id="credit" type="number" className={Style.vminput} placeholder="50000" value={credit} onChange={(e) => setCredit(e.target.value)} />
              </div>

              <div className={Style.vmrow2}>
                <div className={Style.vmfield}>
                  <label htmlFor="paymentTerms" className={Style.vmfieldlabel}>
                    Payment Terms
                  </label>
                  <div className={Style.vmselectwrap}>
                    <select className={Style.vmselect} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
                      <option value="">Select Payment Term</option>
                      <option value="NET30">NET30</option>
                      <option value="NET60">NET60</option>
                      <option value="IMMEDIATE">IMMEDIATE</option>
                    </select>
                    <ChevronDown size={14} className={Style.vmselectcaret} />
                  </div>
                </div>
                <div className={Style.vmfield}>
                  <label className={Style.vmfieldlabel}>Initial Status</label>
                  <div className={Style.vmselectwrap}>
                    <select className={Style.vmselect} value={initialStatus} onChange={(e) => setInitialStatus(e.target.value)}>
                      <option value="">Select Status</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="BLOCKED">BLOCKED</option>
                    </select>
                    <ChevronDown size={14} className={Style.vmselectcaret} />
                  </div>
                </div>
              </div>

              <div className={Style.vmcheckrow}>
                <input type="checkbox" id="subscribeAlerts" className={Style.vmcheckbox} checked={subscribeAlerts} onChange={(e) => setSubscribeAlerts(e.target.checked)} />
                <label htmlFor="subscribeAlerts" className={Style.vmchecklabel}>
                  Subscribe to automated tax compliance alerts
                </label>
              </div>

              <button type="submit" className={Style.vmcreatebtn} disabled={saving || !vendorName.trim() || !taxId.trim()}>
                {saving ? (
                  <>
                    <Loader2 size={15} className={Style.vmspin} />
                    Creating Account...
                  </>
                ) : (
                  "Create Vendor Account"
                )}
              </button>

              <button type="button" className={Style.vmresetlink} onClick={resetForm} disabled={saving}>Reset Form</button>
            </form>
          </div>

          <div className={Style.vmdirectorycard}>
            <div className={Style.vmdirectoryhead}>
              <div className={Style.vmdirectorytitlewrap}>
                <span className={Style.vmdirectorytitle}>Vendor Directory</span>
                <span className={Style.vmtotalchip}>{vendors.length.toLocaleString()} TOTAL</span>
              </div>
              <div className={Style.vmdirectorycontrols}>
                <div className={Style.vmfilterwrap}>
                  <Filter size={14} className={Style.vmfiltericon} />
                  <input className={Style.vmfilterinput} placeholder="Filter by Vendor Name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className={Style.vmmorebtn}><MoreVertical size={16} /></div>
              </div>
            </div>

            <table className={Style.vmtable}>
              <thead>
                <tr className={Style.vmtheadrow}>
                  <th className={Style.vmth}>Vendor ID</th>
                  <th className={Style.vmth}>Name &amp; Contact</th>
                  <th className={Style.vmth}>Tax ID</th>
                  <th className={Style.vmth}>Payment Terms</th>
                  <th className={Style.vmth}>Credit Limit</th>
                  <th className={Style.vmth}>Status</th>
                  <th className={`${Style.vmthlast} ${Style.vmthlast}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className={Style.vmemptyrow}><td colSpan={5}>Loading vendor directory…</td></tr>
                ) : pageItems.length === 0 ? (
                  <tr className={Style.vmemptyrow}><td colSpan={5}>No vendors match your filter.</td></tr>
                ) : (
                  pageItems.map((v) => (
                    <tr key={v.id} className={Style.vmrow}>
                      <td className={`${Style.vmtd} ${Style.vmtdid}`}>#{v.Vendor_number}</td>
                      <td className={Style.vmtd}>
                        {editingId === v.id ? (
                          <>
                            <input className={Style.vmeditinput} value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} />
                            <input className={Style.vmeditinput} value={editDraft.tax_id} onChange={(e) => setEditDraft((d) => ({ ...d, taxId: e.target.value }))} />
                          </>
                        ) : (
                          <>
                            <div className={Style.vmtdname}>{v.name}</div>
                            <div className={Style.vmtdcontact}>{v.contact}</div>
                          </>
                        )}
                      </td>
                      <td className={`${Style.vmtd} ${Style.vmtdtax}`}>
                        {editingId === v.id ? null : v.tax_id}
                      </td>
                      <td className={Style.vmtd}>{v.payment_terms}</td>
                      <td className={Style.vmtd}>{v.credit_limit}</td>
                      <td className={Style.vmtd}><StatusBadge status={v.status} /></td>
                      <td className={Style.vmtd}>
                        <div className={Style.vmtdactions}>
                          {editingId === v.id ? (
                            <div className={Style.vmeditactions}>
                              <button className={Style.vmiconaction} onClick={() => saveEdit(v.id)} aria-label="Save">
                                <Check size={14} />
                              </button>
                              <button className={Style.vmiconaction} onClick={() => setEditingId(null)} aria-label="Cancel">
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <button className={Style.vmiconaction} onClick={() => startEdit(v)} aria-label="Edit">
                                <Pencil size={14} />
                              </button>
                              <button
                                className={`${Style.vmiconaction} ${v.status === "BLOCKED" ? Style.vmblockactive : ""}`}
                                onClick={() => toggleBlock(v._id)}
                                aria-label={v.status === "BLOCKED" ? "Unblock vendor" : "Block vendor"}
                              >
                                <Ban size={14} />
                              </button>
                            </>
                          )}
                        </div>
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
        </div>
      </main>
      <div style={S.toast(toast.visible)} className="border border-success text-success">
        {toast.msg}
      </div>
    </>
  );
}