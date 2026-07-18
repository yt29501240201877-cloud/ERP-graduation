/**
 * A line item is expected to look like:
 *   { qty: number, unitPrice: number, taxRatePct: number }
 *
 * Row amount excludes tax; tax is computed per row (since rows can
 * have different rates) and summed separately - this matches how
 * both the Create Invoice and Invoice Lines screens display numbers.
 */
export function calculateRowAmount(lineItem) {
  const qty = Number(lineItem.qty) || 0;
  const unitPrice = Number(lineItem.unitPrice) || 0;
  return qty * unitPrice;
}

export function calculateRowTax(lineItem) {
  const amount = calculateRowAmount(lineItem);
  const rate = Number(lineItem.taxRatePct) || 0;
  return amount * (rate / 100);
}

export function calculateInvoiceTotals(lineItems = []) {
  const subtotal = lineItems.reduce((sum, item) => sum + calculateRowAmount(item), 0);
  const taxAmount = lineItems.reduce((sum, item) => sum + calculateRowTax(item), 0);
  return {
    subtotal,
    taxAmount,
    total: subtotal + taxAmount,
  };
}
