import { useState, useEffect, useCallback, useRef } from "react";
import { fetchPayments } from "../services/paymentService";

const SEARCH_DEBOUNCE_MS = 350;

/**
 * Same pattern as useInvoices.js: debounced search (optionally
 * supplied externally from the Navbar), pagination, loading/error
 * state, and a guard against out-of-order responses.
 */
export default function usePayments(externalSearchTerm) {
  const [internalSearchInput, setInternalSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const isControlled = typeof externalSearchTerm === "string";
  const searchInput = isControlled ? externalSearchTerm : internalSearchInput;
  const setSearchInput = isControlled ? () => {} : setInternalSearchInput;

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const loadPayments = useCallback(async (params) => {
    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPayments(params);
      if (currentRequestId !== requestIdRef.current) return;

      setItems(data.items);
      setTotal(data.total);
      setPageSize(data.pageSize);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;
      setError(err?.message || "Failed to load payments.");
      setItems([]);
      setTotal(0);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      loadPayments({ page: 1, search: searchInput });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    loadPayments({ page, search: searchInput });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / (pageSize || 1)));

  return {
    items,
    total,
    page,
    totalPages,
    pageSize,
    isLoading,
    error,
    searchInput,
    setSearchInput,
    setPage,
    refresh: () => loadPayments({ page, search: searchInput }),
  };
}
