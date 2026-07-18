/**
 * Mock dataset standing in for a real /api/invoices endpoint.
 * Shape mirrors what the backend is expected to return, so swapping
 * mock data for a real Axios call (see invoiceService.js) requires
 * no changes to any component.
 */
const VENDORS = [
  { name: "Nexus Logistics", vendorId: "V-9912", initials: "NL" },
  { name: "Apex Solutions", vendorId: "V-4482", initials: "AS" },
  { name: "Global Connect", vendorId: "V-1120", initials: "GC" },
  { name: "Bright Path Supplies", vendorId: "V-2210", initials: "BP" },
  { name: "Meridian Freight", vendorId: "V-5531", initials: "MF" },
  { name: "Silverline Tech", vendorId: "V-7743", initials: "ST" },
  { name: "Harbor & Co.", vendorId: "V-3390", initials: "HC" },
  { name: "Crestview Materials", vendorId: "V-6621", initials: "CM" },
];

const STATUSES = ["PENDING", "PAID", "DRAFT"];

function pad(n) {
  return String(n).padStart(4, "0");
}

function seededAmount(seed) {
  const base = ((seed * 137) % 9000) + 100;
  return Math.round(base * 1.37 * 100) / 100;
}

function seededDate(seed, offsetDays) {
  const date = new Date(2023, 9, 20 + (seed % 10) + offsetDays);
  return date;
}

export const MOCK_INVOICES = Array.from({ length: 124 }, (_, i) => {
  const seed = i + 1;
  const vendor = VENDORS[seed % VENDORS.length];
  const status = STATUSES[seed % STATUSES.length];
  const invoiceDate = seededDate(seed, 0);
  const dueDate = seededDate(seed, 30);

  return {
    id: `INV-2023-${pad(45 + seed)}`,
    vendor,
    invoiceDate: invoiceDate.toISOString(),
    dueDate: dueDate.toISOString(),
    amount: seededAmount(seed),
    status,
  };
});

export const MOCK_SUMMARY = {
  totalOutstanding: 412890.0,
  totalOutstandingChangePct: 12,
  pendingApprovalCount: 24,
  pendingApprovalValue: 45200.0,
  dueThisWeekCount: 8,
  dueThisWeekCapacity: 10,
  averagePayCycleDays: 14.2,
  averagePayCycleTargetDays: 15.0,
};
