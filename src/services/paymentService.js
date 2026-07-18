import api from "./api";
import { MOCK_PAYMENTS, MOCK_PAYMENT_SUMMARY } from "./mockPayments";
import { sanitizeSearchTerm } from "../utils/sanitize";

const PAGE_SIZE = 5;
const USE_MOCK = process.env.REACT_APP_USE_MOCK !== "false";

function simulateNetworkDelay(value, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Fetches a page of payments, optionally filtered by free-text
 * search across reference, vendor name, and invoice numbers.
 */
export async function fetchPayments({ page = 1, search = "" }) {
  const cleanSearch = sanitizeSearchTerm(search).toLowerCase();

  if (!USE_MOCK) {
    const { data } = await api.get("/payments", {
      params: { page, search: cleanSearch, pageSize: PAGE_SIZE },
    });
    return data;
  }

  let filtered = MOCK_PAYMENTS;

  if (cleanSearch) {
    filtered = filtered.filter(
      (p) =>
        p.id.toLowerCase().includes(cleanSearch) ||
        p.vendorName.toLowerCase().includes(cleanSearch) ||
        p.invoiceRefs.some((ref) => ref.toLowerCase().includes(cleanSearch))
    );
  }

  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return simulateNetworkDelay({ items, total, page, pageSize: PAGE_SIZE });
}

/** Fetches the three Payments dashboard summary statistics. */
export async function fetchPaymentSummary() {
  if (!USE_MOCK) {
    const { data } = await api.get("/payments/summary");
    return data;
  }
  return simulateNetworkDelay(MOCK_PAYMENT_SUMMARY, 300);
}

/**
 * Requests a CSV export of payment history and returns a Blob.
 * Falls back to a client-side CSV built from mock data when no
 * backend is configured.
 */
export async function exportPaymentsCsv() {
  if (!USE_MOCK) {
    const response = await api.get("/payments/export", { responseType: "blob" });
    return response.data;
  }

  const header = "Date,Reference,Method,Vendor,Invoices,Amount,Status\n";
  const rows = MOCK_PAYMENTS.map((p) =>
    [
      p.date,
      p.id,
      p.method,
      p.vendorName,
      p.invoiceRefs.join(" / "),
      p.amount.toFixed(2),
      p.status,
    ].join(",")
  ).join("\n");

  return simulateNetworkDelay(new Blob([header + rows], { type: "text/csv" }), 200);
}
