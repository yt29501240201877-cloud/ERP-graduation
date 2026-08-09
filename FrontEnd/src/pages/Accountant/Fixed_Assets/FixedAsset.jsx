import { useState, useEffect, useMemo, useRef } from "react";
import { LayoutGrid, Wrench, FileText, Receipt, Users, BarChart3, HelpCircle, LogOut, Search, Download, Upload, ChevronDown, Pencil, Eye, MoreVertical, Loader2, Trash2, Ban, } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Fixed Assets", icon: Wrench, active: true },
  { label: "AR Invoices", icon: FileText },
  { label: "Receipts", icon: Receipt },
  { label: "Customers", icon: Users },
  { label: "Reports", icon: BarChart3 },
];

const CATEGORIES = ["Equipment", "Vehicle", "IT Hardware", "Furniture", "Building", "Land"];
const DEP_METHODS = ["Straight Line", "Declining Balance", "Units of Production"];
const STORAGE_KEY = "enterprise-erp:fixed-assets";
const PAGE_SIZE = 5;

const SEED_ASSETS = [
  { id: "a1", assetId: "FA-23-0014", name: "Haas VF-2 CNC Mill", category: "Equipment", acqDate: "2023-04-12", cost: 51000, residual: 5000, usefulLife: 84, status: "Active" },
  { id: "a2", assetId: "FA-21-0492", name: "Ford Transit Connect 2021", category: "Vehicle", acqDate: "2021-09-01", cost: 28500, residual: 2000, usefulLife: 60, status: "Active" },
  { id: "a3", assetId: "FA-19-0102", name: "Cisco Catalyst 9300 Switch", category: "IT Hardware", acqDate: "2019-02-15", cost: 6200, residual: 0, usefulLife: 48, status: "Active" },
  { id: "a4", assetId: "FA-18-0055", name: "Herman Miller Aeron Chairs (x10)", category: "Furniture", acqDate: "2018-11-20", cost: 9800, residual: 0, usefulLife: 72, status: "Disposed" },
  { id: "a5", assetId: "FA-24-0001", name: "Expansion Annex B", category: "Building", acqDate: "2024-01-10", cost: 850000, residual: 100000, usefulLife: 480, status: "Active" },
  { id: "a6", assetId: "FA-22-0210", name: "Dell PowerEdge R750 Server", category: "IT Hardware", acqDate: "2022-06-05", cost: 11400, residual: 500, usefulLife: 48, status: "Active" },
  { id: "a7", assetId: "FA-20-0330", name: "Toyota Hiace Delivery Van", category: "Vehicle", acqDate: "2020-03-18", cost: 24000, residual: 3000, usefulLife: 60, status: "Active" },
];

function currency(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
}
function monthsElapsed(acqDate) {
  const start = new Date(acqDate + "T00:00:00");
  const now = new Date();
  return Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()));
}
function computeNBV(asset) {
  if (asset.status === "Disposed") return 0;
  const elapsed = monthsElapsed(asset.acqDate);
  const monthlyDep = (asset.cost - asset.residual) / Math.max(1, asset.usefulLife);
  const nbv = asset.cost - monthlyDep * Math.min(elapsed, asset.usefulLife);
  return Math.max(asset.residual, Math.round(nbv * 100) / 100);
}
function displayStatus(asset) {
  if (asset.status === "Disposed") return "Disposed";
  const nbv = computeNBV(asset);
  if (nbv <= asset.residual + 0.01 && monthsElapsed(asset.acqDate) >= asset.usefulLife) return "Fully Depreciated";
  return "Active";
}

function StatusBadge({ status }) {
  const cls =
    status === "Active" ? "fa-badge fa-badge-active" :
      status === "Disposed" ? "fa-badge fa-badge-disposed" :
        "fa-badge fa-badge-depreciated";
  return <span className={cls}>{status}</span>;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const row = {};
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

export default function FixedAssetManagementDark() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [acqDate, setAcqDate] = useState("");
  const [acqCost, setAcqCost] = useState("");
  const [residual, setResidual] = useState("");
  const [usefulLife, setUsefulLife] = useState("");
  const [depMethod, setDepMethod] = useState("Straight Line");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, false);
        const parsed = result ? JSON.parse(result.value) : null;
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setAssets(parsed);
        } else {
          setAssets(SEED_ASSETS);
          await window.storage.set(STORAGE_KEY, JSON.stringify(SEED_ASSETS), false);
        }
      } catch (e) {
        try {
          setAssets(SEED_ASSETS);
          await window.storage.set(STORAGE_KEY, JSON.stringify(SEED_ASSETS), false);
        } catch (e2) {
          setError("Could not initialize asset storage.");
          setAssets(SEED_ASSETS);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next) => {
    setAssets(next);
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
    setEditingId(null);
    setName("");
    setCategory("");
    setStatus("Active");
    setAcqDate("");
    setAcqCost("");
    setResidual("");
    setUsefulLife("");
    setDepMethod("Straight Line");
  };

  const startEdit = (a) => {
    setEditingId(a.id);
    setName(a.name);
    setCategory(a.category);
    setStatus(a.status);
    setAcqDate(a.acqDate);
    setAcqCost(String(a.cost));
    setResidual(String(a.residual));
    setUsefulLife(String(a.usefulLife));
    setDepMethod("Straight Line");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const registerAsset = async (e) => {
    e.preventDefault();
    const cost = parseFloat(acqCost);
    const res = parseFloat(residual) || 0;
    const life = parseInt(usefulLife, 10);
    if (!name.trim() || !category || !acqDate || !cost || cost <= 0 || !life || life <= 0) return;

    if (editingId) {
      const next = assets.map((a) =>
        a.id === editingId ? { ...a, name: name.trim(), category, status, acqDate, cost, residual: res, usefulLife: life } : a
      );
      await persist(next);
    } else {
      const yr = acqDate.slice(2, 4);
      const seq = String(100 + assets.length + Math.floor(Math.random() * 800)).slice(-4);
      const newAsset = {
        id: `a${Date.now()}`,
        assetId: `FA-${yr}-${seq}`,
        name: name.trim(),
        category,
        acqDate,
        cost,
        residual: res,
        usefulLife: life,
        status,
      };
      await persist([newAsset, ...assets]);
    }
    clearForm();
    setPage(1);
  };

  const disposeAsset = async (id) => {
    await persist(assets.map((a) => (a.id === id ? { ...a, status: "Disposed" } : a)));
    setMenuOpenId(null);
  };
  const deleteAsset = async (id) => {
    await persist(assets.filter((a) => a.id !== id));
    setMenuOpenId(null);
  };

  const exportCsv = () => {
    const header = ["Asset ID", "Name", "Category", "Acquisition Date", "Cost", "Residual", "Useful Life (Months)", "Net Book Value", "Status"];
    const rows = filtered.map((a) => [a.assetId, a.name, a.category, a.acqDate, a.cost.toFixed(2), a.residual.toFixed(2), a.usefulLife, computeNBV(a).toFixed(2), displayStatus(a)]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fixed-assets.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkImportClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      const imported = rows
        .map((r, idx) => {
          const cost = parseFloat(r["cost"] || r["acquisition cost"] || "0");
          const life = parseInt(r["useful life (months)"] || r["usefullife"] || r["useful life"] || "0", 10);
          if (!r["name"] || !cost || !life) return null;
          return {
            id: `imp${Date.now()}${idx}`,
            assetId: r["asset id"] || `FA-IMP-${String(idx).padStart(4, "0")}`,
            name: r["name"],
            category: r["category"] || "Equipment",
            acqDate: r["acquisition date"] || r["acqdate"] || new Date().toISOString().slice(0, 10),
            cost,
            residual: parseFloat(r["residual"] || "0") || 0,
            usefulLife: life,
            status: r["status"] || "Active",
          };
        })
        .filter(Boolean);

      if (imported.length === 0) {
        setNotice("No valid rows found. Expected columns: Name, Category, Acquisition Date, Cost, Residual, Useful Life (Months), Status.");
      } else {
        await persist([...imported, ...assets]);
        setNotice(`Imported ${imported.length} asset${imported.length === 1 ? "" : "s"} from ${file.name}.`);
        setPage(1);
      }
    } catch (err) {
      setNotice("Could not read that file. Please upload a CSV exported from this tool or a compatible spreadsheet.");
    } finally {
      e.target.value = "";
      setTimeout(() => setNotice(""), 6000);
    }
  };

  const filtered = useMemo(
    () =>
      assets.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.assetId.toLowerCase().includes(search.toLowerCase())
      ),
    [assets, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const totalNBV = assets.reduce((s, a) => s + computeNBV(a), 0);

  return (
    <div className="fa-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .fa-page{
          min-height:100vh; width:100%; display:flex;
          background:linear-gradient(180deg, #020617 0%, #0A0F1E 55%, #020617 100%);
          color:#E2E8F0; font-family:'Inter', sans-serif;
        }

        .fa-sidebar{
          width:16rem; flex-shrink:0;
          border-right:1px solid rgba(76,141,255,0.1);
          background:rgba(15,23,42,0.6);
          backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          display:flex; flex-direction:column;
        }
        .fa-brand{ padding:1.25rem; border-bottom:1px solid rgba(76,141,255,0.1); }
        .fa-brand-name{ font-family:'Sora', sans-serif; font-weight:700; font-size:1.05rem; color:#F8FAFC; }
        .fa-brand-tag{ font-size:0.78rem; color:#64748B; margin-top:0.15rem; }

        .fa-nav{ flex:1; padding:1rem 0.75rem; display:flex; flex-direction:column; gap:0.25rem; }
        .fa-nav-item{
          width:100%; display:flex; align-items:center; gap:0.75rem;
          padding:0.6rem 0.75rem; border-radius:12px; font-size:0.875rem; font-weight:500;
          border:1px solid transparent; background:none; color:#94A3B8; cursor:pointer;
          transition:background .15s ease, color .15s ease; text-align:left;
        }
        .fa-nav-item:hover{ background:rgba(30,41,59,0.6); color:#E2E8F0; }
        .fa-nav-item.fa-active{ background:rgba(76,141,255,0.15); color:#93C5FD; border-color:rgba(96,165,250,0.2); }

        .fa-sidebar-footer{ padding:0.4rem 1rem 1rem; }
        .fa-footer-link{ display:flex; align-items:center; gap:0.6rem; padding:0.55rem 0.5rem; font-size:0.85rem; color:#64748B; cursor:pointer; }
        .fa-footer-link:hover{ color:#CBD5E1; }

        .fa-main{ flex:1; display:flex; flex-direction:column; min-width:0; }

        .fa-topbar{
          height:4rem; border-bottom:1px solid rgba(76,141,255,0.1);
          background:rgba(15,23,42,0.4); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          display:flex; align-items:center; justify-content:space-between; padding:0 2rem; gap:1.5rem;
        }
        .fa-page-title{ font-family:'Sora', sans-serif; font-weight:700; font-size:1.2rem; color:#F8FAFC; }
        .fa-topbar-actions{ display:flex; gap:0.6rem; }
        .fa-btn-ghost{
          display:flex; align-items:center; gap:0.5rem;
          background:rgba(2,6,23,0.4); border:1px solid rgba(76,141,255,0.15);
          color:#CBD5E1; font-weight:600; font-size:0.82rem;
          padding:0.55rem 0.95rem; border-radius:11px; cursor:pointer;
        }
        .fa-btn-ghost:hover{ background:rgba(30,41,59,0.7); }
        .fa-btn-solid{
          display:flex; align-items:center; gap:0.5rem;
          background:linear-gradient(135deg, #7FB3FF, #4338CA);
          color:#020617; font-weight:700; font-size:0.82rem;
          padding:0.55rem 1rem; border-radius:11px; border:none; cursor:pointer;
        }
        .fa-btn-solid:hover{ filter:brightness(1.1); }

        .fa-content{ flex:1; overflow-y:auto; padding:1.5rem 2rem 2.5rem; }

        .fa-notice{
          background:rgba(76,141,255,0.1); border:1px solid rgba(96,165,250,0.25); color:#93C5FD;
          border-radius:12px; padding:0.75rem 1.1rem; font-size:0.85rem; margin-bottom:1.2rem;
        }

        .fa-layout{ display:grid; grid-template-columns:360px 1fr; gap:1.5rem; align-items:start; }
        @media (max-width:1100px){ .fa-layout{ grid-template-columns:1fr; } }

        .fa-form-card{
          background:rgba(15,23,42,0.5); border:1px solid rgba(76,141,255,0.1);
          border-radius:20px; padding:1.7rem 1.6rem; backdrop-filter:blur(20px);
        }
        .fa-form-title{ font-family:'Sora', sans-serif; font-size:1.3rem; font-weight:700; color:#F8FAFC; margin:0 0 0.35rem; }
        .fa-form-sub{ font-size:0.85rem; color:#94A3B8; margin-bottom:1.4rem; }
        .fa-form-rule{ height:1px; background:rgba(76,141,255,0.12); margin-bottom:1.3rem; }

        .fa-field{ margin-bottom:1.15rem; }
        .fa-field-label{ font-size:0.72rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#93C5FD; margin-bottom:0.5rem; display:block; }
        .fa-input, .fa-select{
          width:100%; background:rgba(2,6,23,0.6); border:1.5px solid rgba(76,141,255,0.14);
          border-radius:12px; padding:0.65rem 0.85rem; font-size:0.88rem; color:#F1F5F9; color-scheme:dark;
        }
        .fa-input::placeholder{ color:#64748B; }
        .fa-input:focus, .fa-select:focus{ outline:none; border-color:#4C8DFF; box-shadow:0 0 0 4px rgba(76,141,255,0.16); }
        .fa-select{ appearance:none; cursor:pointer; }
        .fa-select-wrap{ position:relative; }
        .fa-select-caret{ position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); color:#64748B; pointer-events:none; }

        .fa-row-2{ display:grid; grid-template-columns:1fr 1fr; gap:1rem; }

        .fa-amount-wrap{ position:relative; }
        .fa-amount-symbol{ position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#64748B; font-size:0.86rem; }
        .fa-amount-wrap .fa-input{ padding-left:1.6rem; }

        .fa-form-actions{ display:flex; justify-content:flex-end; gap:0.65rem; margin-top:0.4rem; }
        .fa-btn-clear{
          background:rgba(15,23,42,0.6); border:1px solid rgba(76,141,255,0.15);
          color:#CBD5E1; font-weight:600; font-size:0.85rem;
          padding:0.65rem 1.1rem; border-radius:12px; cursor:pointer;
        }
        .fa-btn-clear:hover{ background:rgba(30,41,59,0.7); }
        .fa-btn-register{
          display:flex; align-items:center; gap:0.5rem;
          background:linear-gradient(135deg, #7FB3FF, #4338CA);
          color:#020617; font-weight:700; font-size:0.85rem;
          padding:0.65rem 1.2rem; border-radius:12px; border:none; cursor:pointer;
        }
        .fa-btn-register:hover{ filter:brightness(1.1); }
        .fa-btn-register:disabled{ opacity:0.55; cursor:not-allowed; }

        .fa-inventory-card{
          background:rgba(15,23,42,0.5); border:1px solid rgba(76,141,255,0.1);
          border-radius:20px; overflow:hidden; backdrop-filter:blur(20px);
        }
        .fa-inv-head{ display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem; padding:1.4rem 1.5rem; }
        .fa-inv-title{ font-family:'Sora', sans-serif; font-size:1.2rem; font-weight:700; color:#F8FAFC; margin-bottom:0.3rem; }
        .fa-inv-sub{ font-size:0.82rem; color:#94A3B8; }
        .fa-inv-sub b{ color:#93C5FD; }

        .fa-search-wrap{ position:relative; width:260px; }
        .fa-search-icon{ position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:#64748B; }
        .fa-search-input{
          width:100%; background:rgba(2,6,23,0.6); border:1px solid rgba(76,141,255,0.15);
          border-radius:11px; padding:0.55rem 0.85rem 0.55rem 2.2rem; font-size:0.85rem; color:#E2E8F0;
        }
        .fa-search-input::placeholder{ color:#64748B; }
        .fa-search-input:focus{ outline:none; border-color:#4C8DFF; }

        .fa-table{ width:100%; font-size:0.85rem; border-collapse:collapse; }
        .fa-thead-row{ background:rgba(30,41,59,0.4); color:#94A3B8; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.04em; }
        .fa-th{ padding:0.65rem 1rem; text-align:left; font-weight:600; }
        .fa-row{ border-top:1px solid rgba(76,141,255,0.05); position:relative; }
        .fa-row:hover{ background:rgba(59,130,246,0.05); }
        .fa-row.fa-row-disposed{ opacity:0.55; }
        .fa-td{ padding:0.85rem 1rem; vertical-align:middle; }
        .fa-td-id{ color:#93C5FD; font-weight:600; font-size:0.8rem; }
        .fa-td-name{ font-weight:600; color:#F1F5F9; }
        .fa-td-cat{ color:#CBD5E1; }
        .fa-td-date{ color:#94A3B8; }
        .fa-td-nbv{ font-weight:700; color:#F8FAFC; text-align:right; font-variant-numeric:tabular-nums; }
        .fa-td-actions{ display:flex; gap:0.45rem; justify-content:flex-end; align-items:center; }

        .fa-action-icon{
          width:1.9rem; height:1.9rem; display:flex; align-items:center; justify-content:center;
          border-radius:7px; border:1px solid rgba(76,141,255,0.12); color:#94A3B8; cursor:pointer; background:none; position:relative;
        }
        .fa-action-icon:hover{ background:rgba(30,41,59,0.6); color:#E2E8F0; }

        .fa-badge{ display:inline-flex; align-items:center; font-size:0.68rem; font-weight:700; padding:0.3rem 0.6rem; border-radius:999px; letter-spacing:0.02em; }
        .fa-badge-active{ background:rgba(16,185,129,0.15); color:#34D399; }
        .fa-badge-depreciated{ background:rgba(100,116,139,0.18); color:#94A3B8; }
        .fa-badge-disposed{ background:rgba(244,63,94,0.12); color:#FB7185; }

        .fa-dropdown{
          position:absolute; right:0; top:100%; margin-top:0.4rem; z-index:10;
          background:#0F172A; border:1px solid rgba(76,141,255,0.2);
          border-radius:10px; overflow:hidden; box-shadow:0 12px 30px rgba(0,0,0,0.4); min-width:160px;
        }
        .fa-dropdown-item{
          display:flex; align-items:center; gap:0.5rem; width:100%;
          padding:0.6rem 0.85rem; font-size:0.82rem; color:#CBD5E1;
          background:none; border:none; cursor:pointer; text-align:left; white-space:nowrap;
        }
        .fa-dropdown-item:hover{ background:rgba(76,141,255,0.1); }
        .fa-dropdown-item.fa-danger{ color:#FB7185; }
        .fa-dropdown-item.fa-danger:hover{ background:rgba(244,63,94,0.1); }

        .fa-empty td{ padding:2.5rem 1rem; text-align:center; color:#64748B; }

        .fa-footer-row{
          display:flex; align-items:center; justify-content:space-between; padding:1rem 1.5rem; flex-wrap:wrap; gap:0.75rem;
          border-top:1px solid rgba(76,141,255,0.1);
        }
        .fa-showing-text{ font-size:0.85rem; color:#94A3B8; }
        .fa-pagination{ display:flex; align-items:center; gap:0.4rem; }
        .fa-page-btn{
          width:2rem; height:2rem; display:flex; align-items:center; justify-content:center;
          border-radius:8px; border:1px solid rgba(76,141,255,0.1); background:transparent; color:#94A3B8; font-size:0.85rem; cursor:pointer;
        }
        .fa-page-btn:hover{ background:rgba(30,41,59,0.6); }
        .fa-page-btn.fa-page-active{ background:#3B82F6; color:#020617; font-weight:700; border-color:#3B82F6; }
        .fa-page-btn:disabled{ opacity:0.4; cursor:not-allowed; }

        .fa-status-bar{ display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; color:#64748B; margin-top:0.9rem; }
        .fa-status-bar.fa-status-error{ color:#FB7185; }
        .fa-spin{ animation:fa-spin 1s linear infinite; }
        @keyframes fa-spin{ to{ transform:rotate(360deg); } }
      `}</style>

      <aside className="fa-sidebar">
        <div className="fa-brand">
          <div className="fa-brand-name">Enterprise ERP</div>
          <div className="fa-brand-tag">Accounts Receivable</div>
        </div>

        <nav className="fa-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.label} className={`fa-nav-item ${item.active ? "fa-active" : ""}`}>
              <item.icon size={17} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="fa-sidebar-footer">
          <div className="fa-footer-link"><HelpCircle size={16} /> Support</div>
          <div className="fa-footer-link"><LogOut size={16} /> Logout</div>
        </div>
      </aside>

      <div className="fa-main">
        <header className="fa-topbar">
          <span className="fa-page-title">Fixed Asset Management</span>
          <div className="fa-topbar-actions">
            <button className="fa-btn-ghost" onClick={exportCsv}>
              <Download size={15} /> Export
            </button>
            <button className="fa-btn-solid" onClick={handleBulkImportClick}>
              <Upload size={15} /> Bulk Import
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" style={{ display: "none" }} onChange={handleFileSelected} />
          </div>
        </header>

        <main className="fa-content">
          {notice && <div className="fa-notice">{notice}</div>}

          <div className="fa-layout">
            <div className="fa-form-card">
              <h2 className="fa-form-title">{editingId ? "Edit Asset" : "Register Asset"}</h2>
              <div className="fa-form-sub">{editingId ? "Update details for this fixed asset." : "Enter details for new fixed asset capitalization."}</div>
              <div className="fa-form-rule" />

              <form onSubmit={registerAsset}>
                <div className="fa-field">
                  <label className="fa-field-label">Asset Name</label>
                  <input className="fa-input" placeholder="e.g. Dell PowerEdge Server" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="fa-row-2" style={{ marginBottom: "1.15rem" }}>
                  <div>
                    <label className="fa-field-label">Category</label>
                    <div className="fa-select-wrap">
                      <select className="fa-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select...</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={14} className="fa-select-caret" />
                    </div>
                  </div>
                  <div>
                    <label className="fa-field-label">Status</label>
                    <div className="fa-select-wrap">
                      <select className="fa-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option>Active</option>
                        <option>Disposed</option>
                      </select>
                      <ChevronDown size={14} className="fa-select-caret" />
                    </div>
                  </div>
                </div>

                <div className="fa-row-2" style={{ marginBottom: "1.15rem" }}>
                  <div>
                    <label className="fa-field-label">Acquisition Date</label>
                    <input type="date" className="fa-input" value={acqDate} onChange={(e) => setAcqDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="fa-field-label">Acquisition Cost</label>
                    <div className="fa-amount-wrap">
                      <span className="fa-amount-symbol">$</span>
                      <input type="number" step="0.01" className="fa-input" placeholder="0.00" value={acqCost} onChange={(e) => setAcqCost(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="fa-form-rule" />

                <div className="fa-row-2" style={{ marginBottom: "1.15rem" }}>
                  <div>
                    <label className="fa-field-label">Residual Value</label>
                    <div className="fa-amount-wrap">
                      <span className="fa-amount-symbol">$</span>
                      <input type="number" step="0.01" className="fa-input" placeholder="0.00" value={residual} onChange={(e) => setResidual(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="fa-field-label">Useful Life (Months)</label>
                    <input type="number" className="fa-input" placeholder="60" value={usefulLife} onChange={(e) => setUsefulLife(e.target.value)} />
                  </div>
                </div>

                <div className="fa-field">
                  <label className="fa-field-label">Depreciation Method</label>
                  <div className="fa-select-wrap">
                    <select className="fa-select" value={depMethod} onChange={(e) => setDepMethod(e.target.value)}>
                      {DEP_METHODS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={14} className="fa-select-caret" />
                  </div>
                </div>

                <div className="fa-form-actions">
                  <button type="button" className="fa-btn-clear" onClick={clearForm}>Clear</button>
                  <button type="submit" className="fa-btn-register" disabled={saving || !name.trim() || !category || !acqDate || !acqCost || !usefulLife}>
                    {saving ? <Loader2 size={14} className="fa-spin" /> : editingId ? "Update Asset" : "Register Asset"}
                  </button>
                </div>
              </form>
            </div>

            <div className="fa-inventory-card">
              <div className="fa-inv-head">
                <div>
                  <div className="fa-inv-title">Asset Inventory</div>
                  <div className="fa-inv-sub">
                    Total Assets: <b>{assets.length.toLocaleString()}</b> &nbsp;|&nbsp; Net Book Value: <b>{currency(totalNBV)}</b>
                  </div>
                </div>
                <div className="fa-search-wrap">
                  <Search size={14} className="fa-search-icon" />
                  <input
                    className="fa-search-input"
                    placeholder="Search Asset ID or Name"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>
              </div>

              <table className="fa-table">
                <thead>
                  <tr className="fa-thead-row">
                    <th className="fa-th">Asset ID</th>
                    <th className="fa-th">Name</th>
                    <th className="fa-th">Category</th>
                    <th className="fa-th">Acq. Date</th>
                    <th className="fa-th" style={{ textAlign: "right" }}>Net Book Value</th>
                    <th className="fa-th">Status</th>
                    <th className="fa-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="fa-empty"><td colSpan={7}>Loading asset inventory…</td></tr>
                  ) : pageItems.length === 0 ? (
                    <tr className="fa-empty"><td colSpan={7}>No assets match your search.</td></tr>
                  ) : (
                    pageItems.map((a) => {
                      const dStatus = displayStatus(a);
                      const isDisposed = dStatus === "Disposed";
                      return (
                        <tr key={a.id} className={`fa-row ${isDisposed ? "fa-row-disposed" : ""}`}>
                          <td className="fa-td fa-td-id">{a.assetId}</td>
                          <td className="fa-td fa-td-name">{a.name}</td>
                          <td className="fa-td fa-td-cat">{a.category}</td>
                          <td className="fa-td fa-td-date">{formatDate(a.acqDate)}</td>
                          <td className="fa-td fa-td-nbv">{currency(computeNBV(a))}</td>
                          <td className="fa-td"><StatusBadge status={dStatus} /></td>
                          <td className="fa-td">
                            <div className="fa-td-actions">
                              {isDisposed ? (
                                <button className="fa-action-icon" aria-label="View"><Eye size={14} /></button>
                              ) : (
                                <button className="fa-action-icon" onClick={() => startEdit(a)} aria-label="Edit"><Pencil size={14} /></button>
                              )}
                              <div style={{ position: "relative" }}>
                                <button className="fa-action-icon" onClick={() => setMenuOpenId(menuOpenId === a.id ? null : a.id)} aria-label="More">
                                  <MoreVertical size={14} />
                                </button>
                                {menuOpenId === a.id && (
                                  <div className="fa-dropdown">
                                    {!isDisposed && (
                                      <button className="fa-dropdown-item" onClick={() => disposeAsset(a.id)}>
                                        <Ban size={14} /> Dispose Asset
                                      </button>
                                    )}
                                    <button className="fa-dropdown-item fa-danger" onClick={() => deleteAsset(a.id)}>
                                      <Trash2 size={14} /> Delete Record
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              <div className="fa-footer-row">
                <div className="fa-showing-text">
                  Showing {pageItems.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}-{(pageSafe - 1) * PAGE_SIZE + pageItems.length} of {filtered.length.toLocaleString()} results
                </div>
                <div className="fa-pagination">
                  <button className="fa-page-btn" disabled={pageSafe === 1} onClick={() => setPage(pageSafe - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                    <button key={p} className={`fa-page-btn ${p === pageSafe ? "fa-page-active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="fa-page-btn" disabled={pageSafe === totalPages} onClick={() => setPage(pageSafe + 1)}>›</button>
                </div>
              </div>
            </div>
          </div>

          <div className={`fa-status-bar ${error ? "fa-status-error" : ""}`}>
            {saving ? "Saving changes…" : error ? error : "All changes are saved automatically to your workspace."}
          </div>
        </main>
      </div>
    </div>
  );
}
