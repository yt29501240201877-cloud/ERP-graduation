/**
 * Strips characters that have no legitimate use in a free-text
 * search box and caps its length, before that string is ever used
 * in a query or logged. Shared by every service (invoices, payments,
 * future modules) so the sanitization rule lives in exactly one place.
 */
export function sanitizeSearchTerm(rawTerm = "") {
  return rawTerm.replace(/[<>"'`;]/g, "").trim().slice(0, 100);
}
