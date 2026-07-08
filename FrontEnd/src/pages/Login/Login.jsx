import { useState } from "react";
import { UseAuth } from '../../components/context/authContext'
import { useNavigate } from 'react-router-dom'
import Style from "./Login.module.css"
import api from '../../components/api';

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { Login } = UseAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please Enter your Email and Password.')
      return
    }

    try {
      setKeepSignedIn(true)
      const response = await api.post("dashboard/login", {
        email: email.trim(),
        password: password,
      })

    console.log("SUCCESS:", response.data)

    localStorage.setItem("token", response.data.token)

    Login(response.data.user || null)

    if (response.data.user?.role === "Admin") {
      navigate('/Dashboard')
    }

  } catch (error) {
    console.log("ERROR:", error)

    setError(error.response?.data?.msg || 'Login failed. Please try again.')
  } finally {
    setKeepSignedIn(false)
  }

  };

  return (
    <div className={Style.page}>

      <div className={{ ...Style.blob, ...Style.blob1 }} />
      <div className={{ ...Style.blob, ...Style.blob2 }} />
      <div className={{ ...Style.blob, ...Style.blob3 }} />
      <div className={Style.gridOverlay} />

      <div className={Style.wrap}>
        <div className={Style.brandRow}>
          <div className={Style.mark}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            </svg>
            <img src="../../../public/Logo.svg" style={{width: "20px", marginRight: "10px"}} />
          </div>
          <div className={Style.brandName}>Flugur ERP</div>
        </div>

        <div className={Style.card}>
          <h1 className={Style.h1}>Welcome back</h1>
          <div className={Style.sub}>Sign in with your enterprise credentials to continue.</div>

          <form onSubmit={handleSubmit}>
            {error && <p className="text-danger mt-2 mb-0">{error}</p>}
            <div className={Style.field}>
              <label className={Style.label} htmlFor="email">Work email</label>
              <div className={Style.inputShell}>
                <svg className={Style.leftIcon} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 6 10 7 10-7" />
                </svg>
                <input id="email" type="email" className="fl-input" className={Style.input} placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
              </div>
            </div>

            <div className={Style.field}>
              <div className={`d-flex justify-content-between ${Style.label}`}>
                <label htmlFor="password" style={{ margin: 0 }}>Password</label>
                <a href="#" className="fl-link" className={Style.forgotLink}>Forgot?</a>
              </div>
              <div className={Style.inputShell}>
                <svg className={Style.leftIcon} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <input id="password" type={showPw ? 'text' : 'password'} className="fl-input" className= {`${Style.input}`} style={{ paddingRight: "2.6rem" }}
                       placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required/>
                <button type="button" className="fl-toggle" className={Style.pwToggle} onClick={() => setShowPw(!showPw)} aria-label="Show password">
                  {showPw ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <path d="M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={Style.checkRow}>
              <input id="keepSignedIn" type="checkbox" className="fl-check" className={Style.checkbox} checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.target.checked)}/>
              <label htmlFor="keepSignedIn" className={Style.checkLabel}>Keep me signed in</label>
            </div>

            <button type="submit" className="fl-btn" className={Style.btn}>
              Sign in
              <svg className="fl-arrow" style={{ transition: "transform .15s ease" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          <div className={Style.divider}>need assistance</div>

          <div className="fl-help" className={Style.helpRow}>
            Trouble signing in? <b>Contact administrator</b>
          </div>

          <div className={Style.metaRow}>
            <span>v1.0.0</span>
            <span className={Style.dot} />
            <span className={Style.secure}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Secure · SSL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
