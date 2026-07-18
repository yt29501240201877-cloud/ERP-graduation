import api from "./api";
import { MOCK_INVOICES, MOCK_SUMMARY } from "./mockInvoices";
import { sanitizeSearchTerm } from "../utils/sanitize";

const PAGE_SIZE = 3;
const USE_MOCK = process.env.REACT_APP_USE_MOCK !== "false";

function simulateNetworkDelay(value, ms = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Fetches a page of invoices, optionally filtered by tab (status)
 * and free-text search across invoice number and vendor name.
 *
 * @param {Object} params
 * @param {number} params.page 1-indexed page number
 * @param {"all"|"pending"|"paid"} params.tab
 * @param {string} params.search raw user input (will be sanitized)
 * @returns {Promise<{items: Array, total: number, page: number, pageSize: number}>}
 */
export async function fetchInvoices({ page = 1, tab = "all", search = "" }) {
  const cleanSearch = sanitizeSearchTerm(search).toLowerCase();

  if (!USE_MOCK) {
    const { data } = await api.get("/invoices", {
      params: { page, tab, search: cleanSearch, pageSize: PAGE_SIZE },
    });
    return data;
  }

  let filtered = MOCK_INVOICES;

  if (tab !== "all") {
    filtered = filtered.filter((inv) => inv.status.toLowerCase() === tab);
  }

  if (cleanSearch) {
    filtered = filtered.filter(
      (inv) =>
        inv.id.toLowerCase().includes(cleanSearch) ||
        inv.vendor.name.toLowerCase().includes(cleanSearch) ||
        inv.vendor.vendorId.toLowerCase().includes(cleanSearch)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return simulateNetworkDelay({ items, total, page, pageSize: PAGE_SIZE });
}

/**
 * Fetches the four dashboard summary statistics.
 */
export async function fetchInvoiceSummary() {
  if (!USE_MOCK) {
    const { data } = await api.get("/invoices/summary");
    return data;
  }
  return simulateNetworkDelay(MOCK_SUMMARY, 300);
}

/**
 * Requests a CSV export from the backend and returns a Blob the
 * caller can turn into a download link. Falls back to a client-side
 * CSV built from mock data when no backend is configured.
 */
export async function exportInvoicesCsv() {
  if (!USE_MOCK) {
    const response = await api.get("/invoices/export", {
      responseType: "blob",
    });
    return response.data;
  }

  const header = "Invoice #,Vendor,Vendor ID,Invoice Date,Due Date,Amount,Status\n";
  const rows = MOCK_INVOICES.map((inv) =>
    [
      inv.id,
      inv.vendor.name,
      inv.vendor.vendorId,
      new Date(inv.invoiceDate).toLocaleDateString(),
      new Date(inv.dueDate).toLocaleDateString(),
      inv.amount.toFixed(2),
      inv.status,
    ].join(",")
  ).join("\n");

  return simulateNetworkDelay(new Blob([header + rows], { type: "text/csv" }), 200);
}
