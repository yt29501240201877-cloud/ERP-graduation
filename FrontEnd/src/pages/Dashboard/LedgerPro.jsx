import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Flugur ERP — Journal Headers
 * Re-skinned with the Flugur ERP dark design system.
 * Architecture matches the original LedgerPro ERP screen 1:1 —
 * only visual language (color, type, surfaces) has been swapped.
 */

const c = {
    bg: "#0A0E1A",
    bgTop: "#0D1220",
    card: "#111827",
    cardAlt: "#0F1521",
    border: "#1F2937",
    borderStrong: "#283142",
    textPrimary: "#F9FAFB",
    textSecondary: "#9CA3AF",
    textMuted: "#6B7280",
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
    page: {
        minHeight: "100vh",
        background: "#030718",
        color: c.textPrimary,
        fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 14,
    },
    topbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: `1px solid ${c.border}`,
        background: c.bgTop,
    },
    topbarLeft: { display: "flex", alignItems: "center", gap: 28 },
    brand: { fontSize: 18, fontWeight: 700, color: c.textPrimary },
    nav: { display: "flex", alignItems: "center", gap: 22 },
    navItemActive: {
        fontSize: 14,
        fontWeight: 600,
        color: c.textPrimary,
        borderBottom: `2px solid ${c.accent}`,
        paddingBottom: 4,
    },
    navItem: {
        fontSize: 14,
        fontWeight: 500,
        color: c.textSecondary,
        paddingBottom: 4,
    },
    topbarRight: { display: "flex", alignItems: "center", gap: 16 },
    iconBtn: {
        width: 34,
        height: 34,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: c.textSecondary,
        border: `1px solid ${c.border}`,
        background: "transparent",
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: 8,
        background: c.accent,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
    },
    container: { padding: "28px 32px 40px" },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
    },
    title: { fontSize: 26, fontWeight: 700, margin: 0, color: c.textPrimary },
    subtitle: { fontSize: 14, color: c.textSecondary, marginTop: 4 },
    headerActions: { display: "flex", gap: 10 },
    btnGhost: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 16px",
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: c.card,
        color: c.textPrimary,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: 0.3,
        cursor: "pointer",
    },
    card: {
        background: "rgba(15, 23, 42, 0.5)",
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 20,
    },
    cardTitle: { fontSize: 16, fontWeight: 700, margin: 0, color: c.textPrimary },
    cardSubtitle: { fontSize: 13, color: c.textSecondary, marginTop: 2 },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 20,
        marginTop: 20,
    },
    label: {
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.6,
        color: c.textMuted,
        textTransform: "uppercase",
        marginBottom: 8,
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: "rgba(2,6,23,0.6)",
        color: c.textPrimary,
        fontSize: 14,
        boxSizing: "border-box",
    },
    inputDisabled: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: "rgba(2,6,23,0.6)",
        color: c.textMuted,
        fontSize: 14,
        boxSizing: "border-box",
    },
    textarea: {
        width: "100%",
        minHeight: 64,
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: "rgba(2,6,23,0.6)",
        color: c.textPrimary,
        fontSize: 14,
        resize: "vertical",
        fontFamily: "inherit",
        boxSizing: "border-box",
    },
    formBottomRow: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: 20,
        marginTop: 20,
        alignItems: "start",
    },
    actionRow: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 20,
        textDecoration: "none"
    },
    btnPrimary: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "linear-gradient(135deg, #7FB3FF, #4338CA)",
        color: "#020617",
        fontWeight: 600,
        fontSize: "0.875rem",
        padding: "0.65rem 1.1rem",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 8px 20px -6px rgba(76, 141, 255, 0.4)",
        transition: "filter .15s ease",
    },
    statGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 20,
        marginBottom: 20,
    },
    statCard: {
        background: "rgba(15, 23, 42, 0.5)",
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: 20,
        display: "flex",
        alignItems: "center",
        gap: 14,
    },
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
    statLabel: {
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.6,
        color: c.textMuted,
        textTransform: "uppercase",
    },
    statValue: { fontSize: 22, fontWeight: 700, color: c.textPrimary, marginTop: 2 },
    tableWrap: {
        background: "rgba(15, 23, 42, 0.5)",
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        overflow: "hidden",
    },
    theadRow: {
        display: "grid",
        gridTemplateColumns: "1.1fr 1.1fr 2.4fr 1fr 1fr 0.8fr",
        padding: "14px 20px",
        borderBottom: `1px solid ${c.border}`,
    },
    th: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.6,
        color: c.textMuted,
        textTransform: "uppercase",
    },
    tr: {
        display: "grid",
        gridTemplateColumns: "1.1fr 1.1fr 2.4fr 1fr 1fr 0.8fr",
        padding: "16px 20px",
        borderBottom: `1px solid ${c.border}`,
        alignItems: "center",
    },
    trLast: {
        display: "grid",
        gridTemplateColumns: "1.1fr 1.1fr 2.4fr 1fr 1fr 0.8fr",
        padding: "16px 20px",
        alignItems: "center",
    },
    td: { fontSize: 14, color: c.textSecondary },
    tdStrong: { fontSize: 14, color: c.textPrimary, fontWeight: 600 },
    statusPillDraft: {
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.4,
        padding: "3px 9px",
        borderRadius: 5,
        background: c.warningSoft,
        color: c.warning,
        textTransform: "uppercase",
        display: "inline-block",
    },
    statusPillPosted: {
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.4,
        padding: "3px 9px",
        borderRadius: 5,
        background: c.accentSoft,
        color: c.accent,
        textTransform: "uppercase",
        display: "inline-block",
    },
    actionsCell: { display: "flex", gap: 12, justifyContent: "flex-end" },
    iconAction: {
        color: c.textMuted,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 32px",
        borderTop: `1px solid ${c.border}`,
        marginTop: 12,
    },
    footerBrand: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.6,
        color: c.textMuted,
    },
    footerLinks: { display: "flex", gap: 24 },
    footerLink: { fontSize: 12.5, color: c.textSecondary },
    footerRight: { fontSize: 12.5, color: c.textMuted },
};

function IconShield() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
        </svg>
    );
}
function IconHelp() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" />
            <line x1="12" y1="17" x2="12" y2="17" />
        </svg>
    );
}
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
    return (
        <div style={styles.page}>
            {/* Top bar */}
            {/* <div style={styles.topbar}>
                <div style={styles.topbarLeft}>
                    <div style={styles.brand}>Flugur Enterprise</div>
                    <div style={styles.nav}>
                        <div style={styles.navItemActive}>Journal Headers</div>
                        <div style={styles.navItem}>General Ledger</div>
                        <div style={styles.navItem}>Reporting</div>
                    </div>
                </div>
                <div style={styles.topbarRight}>
                    <div style={styles.iconBtn}>
                        <IconShield />
                    </div>
                    <div style={styles.iconBtn}>
                        <IconHelp />
                    </div>
                    <div style={styles.avatar}>JD</div>
                </div>
            </div> */}

            <div style={styles.container}>
                {/* Header */}
                <div style={styles.headerRow}>
                    <div>
                        <h1 style={styles.title}>LedgerPro ERP</h1>
                        <div style={styles.subtitle}>Journal Entry Management &amp; Control</div>
                    </div>
                    <div style={styles.headerActions}>
                        <button style={styles.btnGhost}>
                            <IconExport /> EXPORT
                        </button>
                        <button style={styles.btnGhost}>
                            <IconFilter /> FILTER
                        </button>
                    </div>
                </div>

                {/* Create New Journal card */}
                <div style={styles.card}>
                    <div style={styles.cardTitle}>Create New Journal</div>
                    <div style={styles.cardSubtitle}>Initialize a new financial record entry</div>

                    <div style={styles.formGrid}>
                        <div>
                            <label style={styles.label}>Journal Number</label>
                            <input style={styles.inputDisabled} value="JN-2024-0042" disabled />
                        </div>
                        <div>
                            <label style={styles.label}>Date</label>
                            <input style={styles.input} type="date" defaultValue="2024-05-24" />
                        </div>
                        <div>
                            <label style={styles.label}>Period</label>
                            <select style={styles.input}>
                                <option>2024-Q2</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.formBottomRow}>
                        <div>
                            <label style={styles.label}>Description</label>
                            <textarea style={styles.textarea} placeholder="Enter transaction details..." />
                        </div>
                        <div>
                            <label style={styles.label}>Source</label>
                            <select style={styles.input}>
                                <option>Manual Entry</option>
                            </select>
                        </div>
                        <div>
                            <label style={styles.label}>Status</label>
                            <input style={styles.inputDisabled} value="DRAFT" disabled />
                        </div>
                    </div>

                    <NavLink style={styles.actionRow} to="/Dashboard/Flugur_Ent">
                        <button style={styles.btnPrimary}>
                            <IconPlus /> INITIALIZE JOURNAL
                        </button>
                    </NavLink>

                </div>

                {/* Stat cards */}
                <div style={styles.statGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statIconWrap(c.warningSoft)}>
                            <IconDraft />
                        </div>
                        <div>
                            <div style={styles.statLabel}>Draft</div>
                            <div style={styles.statValue}>12</div>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIconWrap(c.accentSoft)}>
                            <IconPosted />
                        </div>
                        <div>
                            <div style={styles.statLabel}>Posted</div>
                            <div style={styles.statValue}>1,248</div>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIconWrap(c.dangerSoft)}>
                            <IconReversed />
                        </div>
                        <div>
                            <div style={styles.statLabel}>Reversed</div>
                            <div style={styles.statValue}>4</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div style={styles.tableWrap}>
                    <div style={styles.theadRow}>
                        <div style={styles.th}>Date</div>
                        <div style={styles.th}>Journal #</div>
                        <div style={styles.th}>Description</div>
                        <div style={styles.th}>Status</div>
                        <div style={styles.th}>Source</div>
                        <div style={{ ...styles.th, textAlign: "right" }}>Actions</div>
                    </div>

                    <div style={styles.tr}>
                        <div style={styles.td}>May 24, 2024</div>
                        <div style={styles.tdStrong}>JN-2024-0041</div>
                        <div style={styles.td}>Quarterly Office Rent - HQ</div>
                        <div>
                            <span style={styles.statusPillDraft}>DRAFT</span>
                        </div>
                        <div style={styles.td}>Manual</div>
                        <div style={styles.actionsCell}>
                            <span style={styles.iconAction}>
                                <IconEdit />
                            </span>
                            <span style={styles.iconAction}>
                                <IconPlay />
                            </span>
                        </div>
                    </div>

                    <div style={styles.tr}>
                        <div style={styles.td}>May 23, 2024</div>
                        <div style={styles.tdStrong}>JN-2024-0040</div>
                        <div style={styles.td}>Cloud Service Subscription Renewal</div>
                        <div>
                            <span style={styles.statusPillPosted}>POSTED</span>
                        </div>
                        <div style={styles.td}>API Sync</div>
                        <div style={styles.actionsCell}>
                            <span style={styles.iconAction}>
                                <IconEye />
                            </span>
                        </div>
                    </div>

                    <div style={styles.trLast}>
                        <div style={styles.td}>May 22, 2024</div>
                        <div style={styles.tdStrong}>JN-2024-0039</div>
                        <div style={styles.td}>Salary Accrual - Engineering Dept</div>
                        <div>
                            <span style={styles.statusPillPosted}>POSTED</span>
                        </div>
                        <div style={styles.td}>Bulk Import</div>
                        <div style={styles.actionsCell}>
                            <span style={styles.iconAction}>
                                <IconEye />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.footerBrand}>FLUGUR ENTERPRISE</div>
                <div style={styles.footerLinks}>
                    <div style={styles.footerLink}>System Status</div>
                    <div style={styles.footerLink}>Security &amp; Privacy</div>
                    <div style={styles.footerLink}>Support</div>
                </div>
                <div style={styles.footerRight}>© 2024 Flugur Enterprise. All rights reserved.</div>
            </div>
        </div >
    );
}