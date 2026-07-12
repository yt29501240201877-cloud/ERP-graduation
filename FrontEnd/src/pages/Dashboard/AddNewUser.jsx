import { useState, useRef } from "react";
import { ChevronRight, ChevronDown, User, Lock, Eye, EyeOff, Info, Shield, RefreshCw } from "lucide-react";
import Style from "./users.module.css"
import api from "../../components/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const S = {
  inputErr: { border: "1px solid #ef4444" },
  errMsg: { fontSize: 12, color: "#ef4444", marginTop: 4 },

  toast: (visible) => ({
    position: "fixed", bottom: 28, right: 28,
    background: "#111827", color: "#fff",
    padding: "13px 20px", borderRadius: 10,
    fontSize: 14, fontWeight: 500,
    boxShadow: "0 4px 16px rgba(0,0,0,.25)",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: "opacity .3s, transform .3s",
    pointerEvents: "none", zIndex: 9999,
  }),
};

export default function AddNewUserDark() {
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, msg: "" });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
    avatarFile: null,
  });

  const fileRef = useRef(null);

  function showToast(msg) {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: "" }), 3000);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(err => ({ ...err, [name]: "" }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors(err => ({ ...err, avatar: "Only JPG or PNG allowed." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(err => ({ ...err, avatar: "File must be under 2 MB." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      setForm(f => ({ ...f, avatar: ev.target.result, avatarFile: file }));
      setErrors(err => ({ ...err, avatar: "" }));
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (!form.role) e.role = "Please assign a role.";
    return e;
  }

  function handleCancel() {
    setForm({ firstName: "", lastName: "", email: "", password: "", role: "", avatar: null, avatarFile: null });
    setErrors({});
    setShowPwd(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const formData = new FormData();

    formData.append("first_name", form.firstName);
    formData.append("last_name", form.lastName);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", form.role);

    if (form.avatarFile) {
      formData.append("image", form.avatarFile);
    }

    try {
      await api.post("dashboard/register", formData);

      showToast("✓ User created successfully!");
      handleCancel();

    } catch (error) {
      console.log(error.response?.data);

      if (error.response?.data?.msg) {
        showToast(error.response.data.msg);
      } else {
        showToast("Something went wrong.");
      }
    }
  };

  return (
    <div className="au-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');



        /* ---------- Content ---------- */
        .au-content{ flex:1; overflow-y:auto; padding:1.75rem 2rem 3rem; }

        .au-breadcrumb{
          display:flex; align-items:center; gap:0.4rem;
          font-size:0.8rem; color:#64748B; margin-bottom:0.9rem;
        }
        .au-breadcrumb b{ color:#CBD5E1; font-weight:600; }

        .au-page-title{
          font-family:'Sora', sans-serif; font-size:1.6rem; font-weight:600; color:#F8FAFC; margin:0;
        }
        .au-page-sub{ color:#94A3B8; font-size:0.9rem; margin-top:0.4rem;  }

        /* ---------- Form card ---------- */
        .au-form-card{
          margin-top:1.6rem;
          background:rgba(15,23,42,0.5);
          border:1px solid rgba(76,141,255,0.1);
          border-radius:20px;
          padding:2rem 2.25rem 1.75rem;
          backdrop-filter:blur(20px);
        }

        .au-section-head{
          display:flex; align-items:center; gap:0.6rem;
          color:#93C5FD; font-size:0.75rem; font-weight:700; letter-spacing:0.08em;
          text-transform:uppercase; margin-bottom:1rem;
        }
        .au-section-head:not(:first-child){ margin-top:2.2rem; }
        .au-section-rule{ flex:1; height:1px; background:rgba(76,141,255,0.12); margin-left:0.5rem; }

        .au-avatar-row{ display:flex; align-items:center; gap:1.5rem; margin-bottom:1.6rem; }
        .au-avatar-upload{
          position:relative; 
          width:84px;
           height:84px;
            border-radius:16px;
          background:rgba(59,130,246,0.08);
           border:1.5px dashed rgba(96,165,250,0.3);
          display:flex;
           align-items:center; 
          justify-content:center;
           flex-shrink:0;
        }
        .au-avatar-edit{
          position:absolute; bottom:-6px; right:-6px;
          width:26px; height:26px; border-radius:50%;
          background:linear-gradient(135deg, #7FB3FF, #3B82F6);
          display:flex; align-items:center; justify-content:center;
          color:#020617; border:2px solid #0A0F1E;
        }
        .au-upload-label{ font-size:0.9rem; font-weight:600; color:#F1F5F9; margin-bottom:0.5rem; }
        .au-upload-row{ display:flex; align-items:center; gap:0.75rem; }
        .au-upload-btn{
          background:rgba(15,23,42,0.6); border:1px solid rgba(76,141,255,0.2);
          color:#CBD5E1; font-size:0.85rem; font-weight:500;
          padding:0.5rem 0.9rem; border-radius:10px; cursor:pointer;
        }
        .au-upload-btn:hover{ background:rgba(30,41,59,0.7); }
        .au-upload-hint{ font-size:0.78rem; color:#64748B; }

        .au-field{ margin-bottom:1.3rem; }
        .au-field-label{
          font-size:0.85rem; font-weight:600; color:#E2E8F0; margin-bottom:0.5rem; display:block;
        }
        .au-required{ color:#FB7185; }
        .au-hint{ font-size:0.78rem; color:#64748B; margin-top:0.4rem; }

        .au-row-2{ display:grid; grid-template-columns:1fr 1fr; gap:1.4rem; }
        @media (max-width:720px){ .au-row-2{ grid-template-columns:1fr; } }

        .au-input-wrap{ position:relative; }
        .au-input{
          width:100%;
          background:rgba(2,6,23,0.6);
          border:1.5px solid rgba(76,141,255,0.14);
          border-radius:12px;
          padding:0.7rem 0.9rem;
          font-size:0.9rem;
          color:#F1F5F9;
        }
        .au-input::placeholder{ color:#64748B; }
        .au-input:focus{
          outline:none; border-color:#4C8DFF;
          box-shadow:0 0 0 4px rgba(76,141,255,0.16);
        }
        .au-input:disabled{ color:#94A3B8; cursor:default; }

        .au-auto-badge{
          position:absolute; right:0.7rem; top:50%; transform:translateY(-50%);
          background:rgba(76,141,255,0.15); color:#93C5FD;
          font-size:0.65rem; font-weight:700; letter-spacing:0.05em;
          padding:0.2rem 0.5rem; border-radius:6px;
        }

        .au-pw-toggle{
          position:absolute; right:0.8rem; top:50%; transform:translateY(-50%);
          background:none; border:none; color:#64748B; cursor:pointer; display:flex;
        }
        .au-pw-toggle:hover{ color:#E2E8F0; }

        .au-strength-track{
          display:flex; gap:4px; margin-top:0.6rem;
        }
        .au-strength-seg{
          flex:1; height:4px; border-radius:2px; background:rgba(76,141,255,0.12);
        }
        .au-strength-seg.au-filled-1{ background:#FB7185; }
        .au-strength-seg.au-filled-2{ background:#FBBF24; }
        .au-strength-seg.au-filled-3{ background:#60A5FA; }
        .au-strength-seg.au-filled-4{ background:#34D399; }
        .au-strength-text{ font-size:0.78rem; color:#64748B; margin-top:0.5rem; }
        .au-strength-text b{ color:#CBD5E1; font-weight:600; }

        .au-select-wrap{ position:relative; }
        .au-select{
          width:100%;
          background:rgba(2,6,23,0.6);
          border:1.5px solid rgba(76,141,255,0.14);
          border-radius:12px;
          padding:0.7rem 2.2rem 0.7rem 0.9rem;
          font-size:0.9rem;
          color:#F1F5F9;
          appearance:none;
          cursor:pointer;
        }
        .au-select:focus{ outline:none; border-color:#4C8DFF; box-shadow:0 0 0 4px rgba(76,141,255,0.16); }
        .au-select-caret{
          position:absolute; right:0.85rem; top:50%; transform:translateY(-50%);
          color:#64748B; pointer-events:none;
        }

        .au-form-footer{
          margin-top:1.8rem;
          padding-top:1.4rem;
          border-top:1px solid rgba(76,141,255,0.1);
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:1rem;
        }
        .au-mandatory-note{ font-size:0.82rem; color:#64748B; }
        .au-mandatory-note span{ color:#FB7185; }

        .au-form-actions{ display:flex; gap:0.75rem; }
        .au-btn-cancel{
          background:rgba(15,23,42,0.6); border:1px solid rgba(76,141,255,0.15);
          color:#CBD5E1; font-weight:600; font-size:0.9rem;
          padding:0.7rem 1.4rem; border-radius:12px; cursor:pointer;
        }
        .au-btn-cancel:hover{ background:rgba(30,41,59,0.7); }
        .au-btn-create{
          background:linear-gradient(135deg, #7FB3FF, #4338CA);
          color:#020617; font-weight:600; font-size:0.9rem;
          padding:0.7rem 1.5rem; border-radius:12px; border:none; cursor:pointer;
          box-shadow:0 8px 20px -6px rgba(76,141,255,0.4);
        }
        .au-btn-create:hover{ filter:brightness(1.1); }

        /* ---------- Info cards ---------- */
        .au-info-grid{
          display:grid; grid-template-columns:1.3fr 1fr 1fr; gap:1rem; margin-top:1.5rem;
        }
        @media (max-width:900px){ .au-info-grid{ grid-template-columns:1fr; } }

        .au-info-card{
          border-radius:16px; padding:1.15rem 1.3rem;
          display:flex; gap:0.8rem;
        }
        .au-info-card.au-info-primary{
          background:linear-gradient(135deg, rgba(76,141,255,0.18), rgba(67,56,202,0.18));
          border:1px solid rgba(96,165,250,0.25);
        }
        .au-info-card.au-info-secondary{
          background:rgba(15,23,42,0.5);
          border:1px solid rgba(76,141,255,0.1);
        }
        .au-info-icon{ flex-shrink:0; margin-top:0.15rem; }
        .au-info-primary .au-info-icon{ color:#93C5FD; }
        .au-info-secondary .au-info-icon{ color:#67E8F9; }
        .au-info-title{ font-size:0.9rem; font-weight:700; color:#F1F5F9; margin-bottom:0.25rem; }
        .au-info-text{ font-size:0.8rem; color:#94A3B8; line-height:1.5; }
     
      `}</style>


      {/* ---------------- MAIN ---------------- */}
      <main className="au-content">
        <div className="au-breadcrumb">
          <span>User Management</span>
          <ChevronRight size={13} />
          <b>Add New User</b>
        </div>

        <h1 className="au-page-title">Add New User</h1>
        <p className="au-page-sub">
          Fill in the information below to create a new user account and assign permissions within the Flugur ecosystem.
        </p>

        <div className="au-form-card">
          <div className="au-section-head">
            <User size={15} /> Basic Information <span className="au-section-rule" />
          </div>

          <div className="au-avatar-row">
            <div className="au-avatar-upload">
              {form.avatar ? (<img src={form.avatar} alt="" className={Style.profileimg} style={{ width: "100%" }} />) : (<User size={30} color="#64748B" />)}
              <div className="au-avatar-edit" title="Click to upload photo" onClick={() => fileRef.current?.click()}>
                {form.avatar ? <img src={form.avatar} alt="avatar" className={Style.profileimg} style={{ width: "100%" }} /> : <i className="bi bi-person-circle" />}
              </div>
            </div>
            <div>
              <div className="au-upload-label">Profile Picture</div>
              <div className="au-upload-row">
                <button className="au-upload-btn" type="button" onClick={() => fileRef.current?.click()}>Upload Photo</button>
                <span className="au-upload-hint">JPG or PNG, max size 2MB</span>
                {errors.avatar && <span className={Style.errMsg}>{errors.avatar}</span>}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleAvatarChange} />
            </div>
          </div>

          <div className="au-field">
            <label className="au-field-label">User ID</label>
            <div className="au-input-wrap">
              <input className="au-input" value="USR-9402" disabled style={{ paddingRight: "3.2rem" }} />
              <span className="au-auto-badge">AUTO</span>
            </div>
            <div className="au-hint">System-generated unique identifier.</div>
          </div>

          <div className="au-row-2">
            <div className="au-field">
              <label className="au-field-label">First Name <span className="au-required">*</span></label>
              <input
                className="au-input"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />

              {errors.firstName && (
                <div className="text-danger p-2 
                 rounded-2 " style={{ fontSize: "12px" }}>
                  <i class="fa-solid fa-triangle-exclamation pe-1"></i>
                  {errors.firstName}</div>
              )}
            </div>
            <div className="au-field">
              <label className="au-field-label">Last Name <span className="au-required">*</span></label>
              <input className="au-input" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />

              {errors.lastName && (
                <div className="text-danger p-2 
                 rounded-2 " style={{ fontSize: "12px" }}>
                  <i class="fa-solid fa-triangle-exclamation pe-1"></i>
                  {errors.lastName}</div>
              )}
            </div>
          </div>

          <div className="au-field">
            <label className="au-field-label">Email Address <span className="au-required">*</span></label>
            <input className="au-input" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" />
            {errors.email && (
              <div className="text-danger p-2 
               rounded-2 "
                style={{ fontSize: "12px" }}><i class="fa-solid fa-triangle-exclamation pe-1"></i>
                {errors.email}</div>
            )}
          </div>

          <div className="au-section-head">
            <Lock size={15} /> Security &amp; Access <span className="au-section-rule" />
          </div>

          <div className="au-field">
            <label className="au-field-label">Initial Password <span className="au-required">*</span></label>
            <div className="au-input-wrap">
              <input type={showPw ? "text" : "password"} className="au-input" style={{ paddingRight: "2.6rem" }} name="password"
                value={form.password} onChange={handleChange} placeholder="Initial Password" />
              <button type="button" className="au-pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && (
                <div className="text-danger p-2 
                 rounded-2 "
                  style={{ fontSize: "12px" }}><i class="fa-solid fa-triangle-exclamation pe-1"></i>
                  {errors.password}</div>
              )}
            </div>
          </div>

          <div className="au-row-2">
            <div className="au-field">
              <label className="au-field-label">Assign Role <span className="au-required">*</span></label>
              <div className="au-select-wrap">
                <select
                  className="au-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Financial Manger">Financial Manager</option>
                  <option value="Procurment Manager">Procurement Manager</option>
                </select>

                {errors.role && (
                  <div className="text-danger p-2 
                   rounded-2 "
                    style={{ fontSize: "12px" }}><i class="fa-solid fa-triangle-exclamation pe-1"></i>
                    {errors.role}</div>
                )}
                <ChevronDown size={15} className="au-select-caret" />
              </div>
            </div>
          </div>

          <div className="au-form-footer">
            <div className="au-mandatory-note">Fields marked with <span>*</span> are mandatory.</div>
            <div className="au-form-actions">
              <button
                type="button"
                className="au-btn-cancel"
                onClick={handleCancel}
              >Cancel</button>
              <button
                type="button"
                className="au-btn-create"
                onClick={handleSubmit}
              >Create User</button>
            </div>
          </div>
        </div>

        <div className="au-info-grid">
          <div className="au-info-card au-info-primary">
            <Info size={18} className="au-info-icon" />
            <div>
              <div className="au-info-title">Automatic Welcome</div>
              <div className="au-info-text">The new user will receive an automated invitation email with login instructions.</div>
            </div>
          </div>
          <div className="au-info-card au-info-secondary">
            <Shield size={18} className="au-info-icon" />
            <div>
              <div className="au-info-title">Access Audit</div>
              <div className="au-info-text">All permission changes are logged in the system security audit trail.</div>
            </div>
          </div>
          <div className="au-info-card au-info-secondary">
            <RefreshCw size={18} className="au-info-icon" />
            <div>
              <div className="au-info-title">LDAP Sync</div>
              <div className="au-info-text">User will be automatically synced with the corporate directory within 24h.</div>
            </div>
          </div>
        </div>
      </main>
      <div style={S.toast(toast.visible)} className="border border-success text-success">
        {toast.msg}
      </div>
    </div>
  );
}
