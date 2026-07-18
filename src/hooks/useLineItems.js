import { useState, useCallback, useMemo } from "react";
import { calculateInvoiceTotals, calculateRowAmount } from "../utils/invoiceMath";

let localIdCounter = 0;
function nextLocalId() {
  localIdCounter += 1;
  return `local-${localIdCounter}`;
}

/**
 * Owns the editable line-item list shared by the Create Invoice and
 * Invoice Lines pages: add/update/remove rows, plus live-recalculated
 * subtotal/tax/total (see utils/invoiceMath.js) any time the list
 * changes.
 */
export default function useLineItems(initialItems = []) {
  const [items, setItems] = useState(
    initialItems.map((item) => ({ id: item.id || nextLocalId(), ...item }))
  );

  const addItem = useCallback((item = {}) => {
    setItems((prev) => [
      ...prev,
      {
        id: nextLocalId(),
        description: "",
        qty: 1,
        unitPrice: 0,
        glAccount: "",
        taxRatePct: 0,
        ...item,
      },
    ]);
  }, []);

  const updateItem = useCallback((id, patch) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const totals = useMemo(() => calculateInvoiceTotals(items), [items]);

  const rowAmounts = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      map[item.id] = calculateRowAmount(item);
    });
    return map;
  }, [items]);

  return { items, addItem, updateItem, removeItem, totals, rowAmounts };
}
