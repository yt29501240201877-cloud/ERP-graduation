import { useState } from "react";
import Style from './Journal_L.module.css'

const c = {
    border: "#1F2937",
};

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
        <>
            <div className={Style.container}>
                {/* Current journal entry summary */}
                <div className={Style.entryCard}>
                    <div>
                        <div className={Style.eyebrow}>Current Journal Entry</div>
                        <div className={Style.entryTitle}>JV-2024-0812</div>
                        <div className={Style.entrySubtitle}>
                            Monthly Accruals - Corporate Headquarters Q3 Utilities
                        </div>
                    </div>
                    <div className={Style.chipRow}>
                        <div className={Style.chip}>
                            <div className={Style.chipLabel}>Date</div>
                            <div className={Style.chipValue}>12 Aug 2024</div>
                        </div>
                        <div className={Style.chip}>
                            <div className={Style.chipLabel}>Currency</div>
                            <div className={Style.chipValue}>USD</div>
                        </div>
                        <div className={Style.chip}>
                            <div className={Style.chipLabel}>Status</div>
                            <div className={Style.chipValueStatus}>
                                <span className={Style.statusDot} />
                                DRAFT
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line items table */}
                <div className={Style.tableWrap}>
                    <div className={Style.theadRow}>
                        <div className={Style.th}>#</div>
                        <div className={Style.th}>GL Account / Search</div>
                        <div className={Style.th}>Description</div>
                        <div className={`${Style.th}`} style={{ textAlign: "left" }}>Debit</div>
                        <div className={`${Style.th}`} style={{ textAlign: "left" }}>Credit</div>
                        <div className={Style.th}></div>
                    </div>

                    {rows.map((itame, index) => (
                        <div className={`${Style.tr}`} style={{ borderBottom: "none" }} key={itame.id}>
                            <div className={Style.rowNum}>{String(index + 1).padStart(2, "0")}</div>
                            <div className={Style.inputWrap}>
                                <input
                                    className={Style.inputWithIcon}
                                    defaultValue={itame.account}

                                />
                                <span className={Style.searchIcon}>
                                    <IconSearch />
                                </span>
                            </div>
                            <div>
                                <input className={Style.input} defaultValue={itame.description} />
                            </div>
                            <div>
                                <input className={Style.numInput} defaultValue={itame.debit} />
                            </div>
                            <div>
                                <input className={Style.numInput} defaultValue={itame.credit} />
                            </div>
                            <div className={Style.trashBtn} onClick={() => handleDeleteRow(itame.id)}>
                                <IconTrash />
                            </div>
                        </div>
                    ))}

                    <div className={Style.addRowWrap} style={{ borderTop: `1px solid ${c.border}` }}>
                        <button className={Style.addRow} onClick={handleAddRow}>
                            <IconPlus /> ADD ROW
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer bar */}
            <div className={Style.footer}>
                <div className={Style.footerLeft}>
                    <div className={Style.totalBlock}>
                        <div className={Style.totalLabel}>Total Debits</div>
                        <div className={Style.totalValue}>$ 2,450.00</div>
                    </div>
                    <div className={Style.totalBlock}>
                        <div className={Style.totalLabel}>Total Credits</div>
                        <div className={Style.totalValue}>$ 2,450.00</div>
                    </div>
                    <div className={Style.divider} />
                    <div className={Style.balancedBadge}>
                        <IconCheckCircle /> BALANCED (0.00)
                    </div>
                </div>
                <div className={Style.footerRight}>
                    <button className={Style.btnGhost}>Save Draft</button>
                    <button className={Style.btnPrimary}>
                        <IconPlay /> Post to Journal
                    </button>
                </div>
            </div>
        </>
    );
}