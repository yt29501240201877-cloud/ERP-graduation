import { useState, useEffect, useCallback, useRef } from "react";
import { fetchInvoices } from "../services/invoiceService";

const SEARCH_DEBOUNCE_MS = 350;

/**
 * Encapsulates all state and data-fetching logic for the invoice
 * table: current tab, search term, pagination, loading and error
 * states. Debounces search input so every keystroke doesn't trigger
 * a network call.
 */
export default function useInvoices(externalSearchTerm) {
  const [tab, setTab] = useState("all");
  const [internalSearchInput, setInternalSearchInput] = useState("");
  const [page, setPage] = useState(1);

  // If the caller supplies a search term (e.g. lifted up to a Navbar
  // search box), that value wins; otherwise this hook manages its own.
  const isControlled = typeof externalSearchTerm === "string";
  const searchInput = isControlled ? externalSearchTerm : internalSearchInput;
  const setSearchInput = isControlled ? () => {} : setInternalSearchInput;

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const loadInvoices = useCallback(async (params) => {
    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchInvoices(params);
      // Guard against out-of-order responses (e.g. a fast tab switch
      // followed by a slow search request resolving later).
      if (currentRequestId !== requestIdRef.current) return;

      setItems(data.items);
      setTotal(data.total);
      setPageSize(data.pageSize);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;
      setError(err?.message || "Failed to load invoices.");
      setItems([]);
      setTotal(0);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Debounced search: reset to page 1 whenever the term changes.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPage(1);
      loadInvoices({ page: 1, tab, search: searchInput });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, tab]);

  // Immediate fetch on page change (no debounce needed).
  useEffect(() => {
    loadInvoices({ page, tab, search: searchInput });
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
    tab,
    setTab: (nextTab) => setTab(nextTab),
    searchInput,
    setSearchInput,
    setPage,
    refresh: () => loadInvoices({ page, tab, search: searchInput }),
  };
}
