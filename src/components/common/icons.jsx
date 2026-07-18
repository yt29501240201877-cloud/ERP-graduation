import React from "react";

/**
 * Central place for small inline SVG icons reused across the app.
 * Keeping them here (instead of copy-pasted inline per component)
 * means one wallet/filter/download icon to update, not five.
 */

export const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M19.4 13a7.97 7.97 0 000-2l2-1.5-2-3.4-2.4.6a8 8 0 00-1.7-1L15 3h-4l-.3 2.7a8 8 0 00-1.7 1l-2.4-.6-2 3.4L6.6 11a7.97 7.97 0 000 2l-2 1.5 2 3.4 2.4-.6a8 8 0 001.7 1L11 21h4l.3-2.7a8 8 0 001.7-1l2.4.6 2-3.4-2-1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9.5 9.5a2.5 2.5 0 114.2 1.8c-.9.8-1.7 1.2-1.7 2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" />
  </svg>
);

export const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M7 4v16m0 0l-3-3m3 3l3-3M17 20V4m0 0l3 3m-3-3l-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TrendUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "-1px" }}>
    <path d="M4 16l6-6 4 4 6-8M14 6h6v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 7a2 2 0 012-2h13a1 1 0 011 1v3H5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M3 7v11a2 2 0 002 2h14a1 1 0 001-1v-9a1 1 0 00-1-1H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="16.5" cy="14.5" r="1.3" fill="currentColor" />
  </svg>
);

export const ClipboardClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="14" r="4" stroke="currentColor" strokeWidth="1.4" />
    <path d="M12 12v2h1.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const ShieldCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "-2px" }}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8.5 12.5l2.3 2.3L15.5 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BankIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M3 10l9-6 9 6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M5 10v9M10 10v9M14 10v9M19 10v9M3 21h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const CheckPaymentIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M6 15c1.5-2 3-2 4.5 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M15 9h4M15 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const GlobeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const DotsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="19" r="1.6" fill="currentColor" />
  </svg>
);
