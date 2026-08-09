import { useState, useRef } from "react";
import { ChevronRight, User, Lock, Eye, EyeOff, Info, Shield, RefreshCw, ChevronDown } from "lucide-react";
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
    <>
      <main className={Style.aucontent}>
        <div className={Style.aubreadcrumb}>
          <span>User Management</span>
          <ChevronRight size={13} />
          <b>Add New User</b>
        </div>

        <h1 className={Style.aupagetitle}>Add New User</h1>
        <p className={Style.aupagesub}>
          Fill in the information below to create a new user account and assign permissions within the Flugur ecosystem.
        </p>

        <div className={Style.auformcard}>
          <div className={Style.ausectionhead}>
            <User size={15} /> Basic Information <span className={Style.ausectionrule} />
          </div>

          <div className={Style.auavatarrow}>
            <div className={Style.auavatarupload}>
              {form.avatar ? (<img src={form.avatar} alt="" className={Style.profileimg} style={{ width: "100%" }} />) : (<User size={30} color="#64748B" />)}
              <div className={Style.auavataredit} title="Click to upload photo" onClick={() => fileRef.current?.click()}>
                {form.avatar ? <img src={form.avatar} alt="avatar" className={Style.profileimg} style={{ width: "100%" }} /> : <i className="bi bi-person-circle" />}
              </div>
            </div>

            <div>
              <div className={Style.auuploadlabel}>Profile Picture</div>
              <div className={Style.auuploadrow}>
                <button className={Style.auuploadbtn} type="button" onClick={() => fileRef.current?.click()}>Upload Photo</button>
                <span className={Style.auuploadhint}>JPG or PNG, max size 2MB</span>
                {errors.avatar && <span className={Style.errMsg}>{errors.avatar}</span>}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleAvatarChange} />
            </div>
          </div>

          <div className={Style.aurow2}>
            <div className={Style.aufield}>
              <label className={Style.aufieldlabel}>First Name <span className={Style.aurequired}>*</span></label>
              <input className={Style.auinput} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
              {errors.firstName && (<div className="text-danger p-2 rounded-2 " style={{ fontSize: "12px" }}><i class="fa-solid fa-triangle-exclamation pe-1"></i>{errors.firstName}</div>)}</div>

            <div className={Style.aufield}>
              <label className={Style.aufieldlabel}>Last Name <span className={Style.aurequired}>*</span></label>
              <input className={Style.auinput} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
              {errors.lastName && (<div className="text-danger p-2 rounded-2 " style={{ fontSize: "12px" }}><i class="fa-solid fa-triangle-exclamation pe-1"></i>{errors.lastName}</div>)}</div>
          </div>

          <div className={Style.aufield}>
            <label className={Style.aufieldlabel}>Email Address <span className={Style.aurequired}>*</span></label>
            <input className={Style.auinput} name="email" value={form.email} onChange={handleChange} placeholder="Email Address" />
            {errors.email && (<div className="text-danger p-2 rounded-2 " style={{ fontSize: "12px" }}><i class="fa-solid fa-triangle-exclamation pe-1"></i> {errors.email}</div>)}</div>
          <div className={Style.ausectionhead}>
            <Lock size={15} /> Security &amp; Access <span className={Style.ausectionrule} />
          </div>

          <div className={Style.aufield}>
            <label className={Style.aufieldlabel}>Initial Password <span className={Style.aurequired}>*</span></label>
            <div className={Style.auinputwrap}>
              <input type={showPw ? "text" : "password"} className={Style.auinput} style={{ paddingRight: "2.6rem" }} name="password"
                value={form.password} onChange={handleChange} placeholder="Initial Password" />
              <button type="button" className={Style.aupwtoggle} onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && (<div className="text-danger p-2 rounded-2 " style={{ fontSize: "12px" }}><i class="fa-solid fa-triangle-exclamation pe-1"></i>{errors.password}</div>)}</div>
          </div>

          <div className={Style.aurow2}>
            <div className={Style.aufield}>
              <label className={Style.aufieldlabel}>Assign Role <span className={Style.aurequired}>*</span></label>
              <div className={Style.auselectwrap}>
                <select className={Style.auselect} name="role" value={form.role} onChange={handleChange}>
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Financial Manger">Accounting Manager</option>
                  <option value="Financial Manger">Financial Manager</option>
                  <option value="Procurment Manager">Procurement Manager</option>
                </select>

                {errors.role && (<div className="text-danger p-2 rounded-2 " style={{ fontSize: "12px" }}><i class="fa-solid fa-triangle-exclamation pe-1"></i>{errors.role}</div>)}
                <ChevronDown size={15} className={Style.auselectcaret} />
              </div>
            </div>
          </div>

          <div className={Style.auformfooter}>
            <div className={Style.aumandatorynote}>Fields marked with <span className={Style.aurequired}>*</span> are mandatory.</div>
            <div className={Style.auformactions}>
              <button type="button" className={Style.aubtncancel} onClick={handleCancel}>Cancel</button>
              <button type="button" className={Style.aubtncreate} onClick={handleSubmit}>Create User</button>
            </div>
          </div>
        </div>

        <div className={Style.auinfogrid}>
          <div className={`${Style.auinfocard} ${Style.auinfoprimary}`}>
            <Info size={18} className={Style.auinfoicon}/>
            <div>
              <div className={Style.auinfotitle}>Automatic Welcome</div>
              <div className={Style.auinfotext}>The new user will receive an automated invitation email with login instructions.</div>
            </div>
          </div>
          <div className={`${Style.auinfocard} ${Style.auinfosecondary}`}>
            <Shield size={18} className={Style.auinfoicon} />
            <div>
              <div className={Style.auinfotitle}>Access Audit</div>
              <div className={Style.auinfotext}>All permission changes are logged in the system security audit trail.</div>
            </div>
          </div>
          <div className={`${Style.auinfocard} ${Style.auinfosecondary}`}>
            <RefreshCw size={18} className={Style.auinfoicon} />
            <div>
              <div className={Style.auinfotitle}>LDAP Sync</div>
              <div className={Style.auinfotext}>User will be automatically synced with the corporate directory within 24h.</div>
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
