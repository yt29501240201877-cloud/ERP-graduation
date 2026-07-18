/**
 * Mock dataset standing in for a real /api/payments endpoint.
 * Shape mirrors what the backend is expected to return so swapping
 * mock data for a real Axios call (see paymentService.js) requires
 * no changes to any component.
 */
const RECORDS = [
  {
    id: "BT-001294",
    date: "2023-10-24",
    method: "bank_transfer",
    vendorName: "Global Logistics Inc.",
    invoiceRefs: ["8821", "8822"],
    amount: 12450.0,
    status: "Completed",
  },
  {
    id: "CK-00992",
    date: "2023-10-23",
    method: "check",
    vendorName: "Tech Solutions Ltd.",
    invoiceRefs: ["4500-B"],
    amount: 3200.0,
    status: "Processing",
  },
  {
    id: "ON-11029",
    date: "2023-10-22",
    method: "online",
    vendorName: "Office Supply Co.",
    invoiceRefs: ["OFF-992"],
    amount: 842.25,
    status: "Draft",
  },
  {
    id: "BT-001288",
    date: "2023-10-19",
    method: "bank_transfer",
    vendorName: "Crestview Materials",
    invoiceRefs: ["6011"],
    amount: 7420.5,
    status: "Completed",
  },
  {
    id: "CK-00981",
    date: "2023-10-17",
    method: "check",
    vendorName: "Harbor & Co.",
    invoiceRefs: ["3390-A", "3390-B"],
    amount: 1980.0,
    status: "Completed",
  },
  {
    id: "ON-11004",
    date: "2023-10-15",
    method: "online",
    vendorName: "Silverline Tech",
    invoiceRefs: ["7743"],
    amount: 5610.75,
    status: "Processing",
  },
];

export const MOCK_PAYMENTS = RECORDS;

export const MOCK_PAYMENT_SUMMARY = {
  totalOutstanding: 248590.22,
  totalOutstandingChangePct: 12.4,
  processingCount: 14,
  processingValue: 42300.0,
  recentCompletions: 128,
  recentCompletionsNote: "All reconciled for Q3",
};
