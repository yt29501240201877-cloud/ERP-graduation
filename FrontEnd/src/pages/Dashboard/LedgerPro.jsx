import React from "react";

import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import Style from './Journal_H.module.css'

const c = {
    accent: "#6366F1",
    accentSoft: "#6366F11A",
    success: "#22C55E",
    successSoft: "#22C55E1A",
    warning: "#F59E0B",
    warningSoft: "#F59E0B1A",
    danger: "#EF4444",
    dangerSoft: "#EF44441A",
};

const styles = {
    statIconWrap: (bg) => ({
        width: 40,
        height: 40,
        borderRadius: 10,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    }),
};

function IconExport() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15V3M12 15l-4-4M12 15l4-4" />
            <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
    );
}
function IconFilter() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16l-6 8v6l-4 2v-8L4 4z" />
        </svg>
    );
}
function IconPlus() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}
function IconDraft() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.warning} strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 015 0" />
        </svg>
    );
}
function IconPosted() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}
function IconReversed() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.danger} strokeWidth="2">
            <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
        </svg>
    );
}
function IconEdit() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
    );
}
function IconPlay() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    );
}
function IconEye() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export default function JournalHeaders() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/Dashboard/Flugur_Ent");
    };

    return (
        <div className={Style.page}>

            <div className={Style.container}>
                {/* Header */}
                <div className={Style.headerRow}>
                    <div>
                        <h1 className={Style.title}>LedgerPro ERP</h1>
                        <div className={Style.subtitle}>Journal Entry Management &amp; Control</div>
                    </div>
                    <div className={Style.headerActions}>
                        <button className={Style.btnGhost}>
                            <IconExport /> EXPORT
                        </button>
                        <button className={Style.btnGhost}>
                            <IconFilter /> FILTER
                        </button>
                    </div>
                </div>

                {/* Create New Journal card */}
                <form className={Style.card} onSubmit={handleSubmit} >
                    <div className={Style.cardTitle}>Create New Journal</div>
                    <div className={Style.cardSubtitle}>Initialize a new financial record entry</div>

                    <div className={Style.formGrid}>
                        <div>
                            <label className={Style.label}>Journal Number</label>
                            <input className={Style.inputDisabled} value="JN-2024-0042" disabled />
                        </div>
                        <div>
                            <label className={Style.label}>Date</label>
                            <input className={Style.input} type="date" defaultValue="2024-05-24" />
                        </div>
                        <div>
                            <label className={Style.label}>Period</label>
                            <select className={Style.input}>
                                <option>2024-Q2</option>
                            </select>
                        </div>
                    </div>

                    <div className={Style.formBottomRow}>
                        <div>
                            <label className={Style.label}>Description</label>
                            <textarea className={Style.textarea} placeholder="Enter transaction details..." required />
                        </div>
                        <div>
                            <label className={Style.label}>Source</label>
                            <select className={Style.input}>
                                <option>Manual Entry</option>
                            </select>
                        </div>
                        <div>
                            <label className={Style.label}>Status</label>
                            <input className={Style.inputDisabled} value="DRAFT" disabled />
                        </div>
                    </div>
                    <button className={Style.btnPrimary} type="submit">
                        <IconPlus /> INITIALIZE JOURNAL
                    </button>



                </form>

                {/* Stat cards */}
                <div className={Style.statGrid}>
                    <div className={Style.statCard}>
                        <div style={styles.statIconWrap(c.warningSoft)}>
                            <IconDraft />
                        </div>
                        <div>
                            <div className={Style.statLabel}>Draft</div>
                            <div className={Style.statValue}>12</div>
                        </div>
                    </div>
                    <div className={Style.statCard}>
                        <div style={styles.statIconWrap(c.accentSoft)}>
                            <IconPosted />
                        </div>
                        <div>
                            <div className={Style.statLabel}>Posted</div>
                            <div className={Style.statValue}>1,248</div>
                        </div>
                    </div>
                    <div className={Style.statCard}>
                        <div style={styles.statIconWrap(c.dangerSoft)}>
                            <IconReversed />
                        </div>
                        <div>
                            <div className={Style.statLabel}>Reversed</div>
                            <div className={Style.statValue}>4</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className={Style.tableWrap}>
                    <div className={Style.theadRow}>
                        <div className={Style.th}>Date</div>
                        <div className={Style.th}>Journal #</div>
                        <div className={Style.th}>Description</div>
                        <div className={Style.th}>Status</div>
                        <div className={Style.th}>Source</div>
                        <div className={Style.th} style={{  textAlign: "right" }}>Actions</div>
                    </div>

                    <div className={Style.tr}>
                        <div className={Style.td}>May 24, 2024</div>
                        <div className={Style.tdStrong}>JN-2024-0041</div>
                        <div className={Style.td}>Quarterly Office Rent - HQ</div>
                        <div>
                            <span className={Style.statusPillDraft}>DRAFT</span>
                        </div>
                        <div className={Style.td}>Manual</div>
                        <div className={Style.actionsCell}>
                            <span className={Style.iconAction}>
                                <IconEdit />
                            </span>
                            <span className={Style.iconAction}>
                                <IconPlay />
                            </span>
                        </div>
                    </div>

                    <div className={Style.tr}>
                        <div className={Style.td}>May 23, 2024</div>
                        <div className={Style.tdStrong}>JN-2024-0040</div>
                        <div className={Style.td}>Cloud Service Subscription Renewal</div>
                        <div>
                            <span className={Style.statusPillPosted}>POSTED</span>
                        </div>
                        <div className={Style.td}>API Sync</div>
                        <div className={Style.actionsCell}>
                            <span className={Style.iconAction}>
                                <IconEye />
                            </span>
                        </div>
                    </div>

                    <div className={Style.trLast}>
                        <div className={Style.td}>May 22, 2024</div>
                        <div className={Style.tdStrong}>JN-2024-0039</div>
                        <div className={Style.td}>Salary Accrual - Engineering Dept</div>
                        <div>
                            <span className={Style.statusPillPosted}>POSTED</span>
                        </div>
                        <div className={Style.td}>Bulk Import</div>
                        <div className={Style.actionsCell}>
                            <span className={Style.iconAction}>
                                <IconEye />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}