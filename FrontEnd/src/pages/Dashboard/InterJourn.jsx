import { UserStar } from "lucide-react";
import React, { useState } from "react";

/**
 * Flugur ERP — Journal Lines
 * Re-skinned with the Flugur ERP dark design system.
 * Architecture matches the original screen 1:1 —
 * only visual language (color, type, surfaces) has been swapped.
 */

const c = {
    bg: "#0A0E1A",
    bgTop: "#0D1220",
    bgFooter: "#0D1220",
    card: "#111827",
    cardAlt: "#0F1521",
    border: "#1F2937",
    textPrimary: "#F9FAFB",
    textSecondary: "#9CA3AF",
    textMuted: "#6B7280",
    accent: "#6366F1",
    accentSoft: "#6366F11A",
    success: "#22C55E",
    successSoft: "#22C55E1A",
    danger: "#EF4444",
};

const styles = {
    page: {
        minHeight: "100vh",
        background: "#040819",
        color: c.textPrimary,
        fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 14,
        display: "flex",
        flexDirection: "column",
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
    container: { padding: "24px 32px 40px", flex: 1 },

    entryCard: {
        background: "rgba(15,23,42,0.5)",
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 16,
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.6,
        color: c.textMuted,
        textTransform: "uppercase",
        marginBottom: 6,
    },
    entryTitle: { fontSize: 22, fontWeight: 700, color: c.textPrimary },
    entrySubtitle: { fontSize: 13.5, color: c.textSecondary, marginTop: 4 },
    chipRow: { display: "flex", gap: 12 },
    chip: {
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: "8px 16px",
        background: "rgba(2,6,23,0.6)",
        minWidth: 90,
    },
    chipLabel: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
        color: c.textMuted,
        textTransform: "uppercase",
    },
    chipValue: { fontSize: 13.5, fontWeight: 600, color: c.textPrimary, marginTop: 4 },
    chipValueStatus: {
        fontSize: 13.5,
        fontWeight: 700,
        color: c.accent,
        marginTop: 4,
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: c.accent,
        display: "inline-block",
    },

    tableWrap: {
        background: "rgba(15,23,42,0.5)",
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        overflow: "hidden",
    },
    theadRow: {
        display: "grid",
        gridTemplateColumns: "0.4fr 2.4fr 2.6fr 1.1fr 1.1fr 0.4fr",
        padding: "12px 20px",
        background: "rgba(15,23,42,0.5)",
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
        gridTemplateColumns: "0.4fr 2.4fr 2.6fr 1.1fr 1.1fr 0.4fr",
        padding: "12px 20px",
        borderBottom: `1px solid ${c.border}`,
        alignItems: "center",
        gap: 12,
    },
    rowNum: { fontSize: 13, color: c.textMuted, fontWeight: 600 },
    inputWrap: { position: "relative" },
    input: {
        width: "100%",
        padding: "9px 12px",
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: "rgba(2,6,23,0.6)",
        color: c.textPrimary,
        fontSize: 13.5,
        boxSizing: "border-box",
    },
    inputWithIcon: {
        width: "100%",
        padding: "9px 32px 9px 12px",
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: "rgba(2,6,23,0.6)",
        color: c.textPrimary,
        fontSize: 13.5,
        boxSizing: "border-box",
    },
    searchIcon: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        color: c.textMuted,
    },
    numInput: {
        width: "100%",
        padding: "9px 12px",
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: "rgba(2,6,23,0.6)",
        color: c.textPrimary,
        fontSize: 13.5,
        textAlign: "right",
        boxSizing: "border-box",
    },
    trashBtn: {
        color: c.textMuted,
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
    },
    addRowWrap: { padding: "14px 20px" },
    addRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: c.textSecondary,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.5,
        cursor: "pointer",
        background: "none",
        border: "none",
    },

    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 32px",
        borderTop: `1px solid ${c.border}`,
        background: c.bgFooter,
    },
    footerLeft: { display: "flex", alignItems: "center", gap: 28 },
    totalBlock: { display: "flex", flexDirection: "column" },
    totalLabel: {
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.5,
        color: c.textMuted,
        textTransform: "uppercase",
    },
    totalValue: { fontSize: 16, fontWeight: 700, color: c.textPrimary, marginTop: 2 },
    divider: { width: 1, height: 30, background: c.border },
    balancedBadge: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 20,
        background: c.successSoft,
        color: c.success,
        fontSize: 12,
        fontWeight: 700,
    },
    footerRight: { display: "flex", gap: 12 },
    btnGhost: {
        padding: "11px 20px",
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: c.card,
        color: c.textPrimary,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
    },
    btnPrimary: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "11px 20px",
        borderRadius: 8,
        border: "none",
        background: c.accent,
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
    },
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
function IconSearch() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}
function IconTrash() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
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
function IconCheckCircle() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
    );
}
function IconPlay() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    );
}

export default function JournalLines() {
    const [rows, setRows] = useState([
        {
            id: 1,
            account: "6100-001 - Electricity Expense",
            description: "HQ Main Building August",
            debit: "2450.00",
            credit: "0.00",
        },
        {
            id: 2,
            account: "2100-000 - Accounts Payable",
            description: "Utility Accrual Q3-Aug",
            debit: "0.00",
            credit: "2450.00",
        },
    ]);



    const handleAddRow = () => {
        const newRow = {
            id: Date.now(),
            account: "",
            description: "",
            debit: "",
            credit: "",
        };

        setRows([...rows, newRow]);
        console.log(rows);
    };


    const handleDeleteRow = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };
    return (
        <div style={styles.page}>
            {/* Top bar */}
            {/* <div style={styles.topbar}>
                <div style={styles.topbarLeft}>
                    <div style={styles.brand}>Flugur Enterprise</div>
                    <div style={styles.nav}>
                        <div style={styles.navItemActive}>Journals</div>
                        <div style={styles.navItem}>Accounts</div>
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
                {/* Current journal entry summary */}
                <div style={styles.entryCard}>
                    <div>
                        <div style={styles.eyebrow}>Current Journal Entry</div>
                        <div style={styles.entryTitle}>JV-2024-0812</div>
                        <div style={styles.entrySubtitle}>
                            Monthly Accruals - Corporate Headquarters Q3 Utilities
                        </div>
                    </div>
                    <div style={styles.chipRow}>
                        <div style={styles.chip}>
                            <div style={styles.chipLabel}>Date</div>
                            <div style={styles.chipValue}>12 Aug 2024</div>
                        </div>
                        <div style={styles.chip}>
                            <div style={styles.chipLabel}>Currency</div>
                            <div style={styles.chipValue}>USD</div>
                        </div>
                        <div style={styles.chip}>
                            <div style={styles.chipLabel}>Status</div>
                            <div style={styles.chipValueStatus}>
                                <span style={styles.statusDot} />
                                DRAFT
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line items table */}
                <div style={styles.tableWrap}>
                    <div style={styles.theadRow}>
                        <div style={styles.th}>#</div>
                        <div style={styles.th}>GL Account / Search</div>
                        <div style={styles.th}>Description</div>
                        <div style={{ ...styles.th, textAlign: "right" }}>Debit</div>
                        <div style={{ ...styles.th, textAlign: "right" }}>Credit</div>
                        <div style={styles.th}></div>
                    </div>

                    {/* <div style={styles.tr}>
                        <div style={styles.rowNum}>01</div>
                        <div style={styles.inputWrap}>
                            <input
                                style={styles.inputWithIcon}
                                defaultValue="6100-001 - Electricity Expense"
                            />
                            <span style={styles.searchIcon}>
                                <IconSearch />
                            </span>
                        </div>
                        <div>
                            <input style={styles.input} defaultValue="HQ Main Building August" />
                        </div>
                        <div>
                            <input style={styles.numInput} defaultValue="2450.00" />
                        </div>
                        <div>
                            <input style={styles.numInput} defaultValue="0.00" />
                        </div>
                        <div style={styles.trashBtn}>
                            <IconTrash />
                        </div>
                    </div> */}

                    {rows.map((itame, index) => (
                        <div style={{ ...styles.tr, borderBottom: "none" }} key={itame.id}>
                            <div style={styles.rowNum}>{String(index + 1).padStart(2, "0")}</div>
                            <div style={styles.inputWrap}>
                                <input
                                    style={styles.inputWithIcon}
                                    defaultValue={itame.account}

                                />
                                <span style={styles.searchIcon}>
                                    <IconSearch />
                                </span>
                            </div>
                            <div>
                                <input style={styles.input} defaultValue={itame.description} />
                            </div>
                            <div>
                                <input style={styles.numInput} defaultValue={itame.debit} />
                            </div>
                            <div>
                                <input style={styles.numInput} defaultValue={itame.credit} />
                            </div>
                            <div style={styles.trashBtn} onClick={() => handleDeleteRow(itame.id)}>
                                <IconTrash />
                            </div>
                        </div>
                    ))}

                    <div style={{ ...styles.addRowWrap, borderTop: `1px solid ${c.border}` }}>
                        <button style={styles.addRow} onClick={handleAddRow}>
                            <IconPlus /> ADD ROW
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer bar */}
            <div style={styles.footer}>
                <div style={styles.footerLeft}>
                    <div style={styles.totalBlock}>
                        <div style={styles.totalLabel}>Total Debits</div>
                        <div style={styles.totalValue}>$ 2,450.00</div>
                    </div>
                    <div style={styles.totalBlock}>
                        <div style={styles.totalLabel}>Total Credits</div>
                        <div style={styles.totalValue}>$ 2,450.00</div>
                    </div>
                    <div style={styles.divider} />
                    <div style={styles.balancedBadge}>
                        <IconCheckCircle /> BALANCED (0.00)
                    </div>
                </div>
                <div style={styles.footerRight}>
                    <button style={styles.btnGhost}>Save Draft</button>
                    <button style={styles.btnPrimary}>
                        <IconPlay /> Post to Ledger
                    </button>
                </div>
            </div>
        </div >
    );
}