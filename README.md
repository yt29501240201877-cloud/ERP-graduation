# AP Invoice Dashboard | لوحة فواتير الحسابات الدائنة

React + React Router + Axios implementation of the ERP Finance
"Accounts Payable → Invoices" screen.

## تشغيل المشروع (Run locally)

```bash
npm install
cp .env.example .env   # عدّل القيم لو عندك backend حقيقي
npm start
```

The app runs on `http://localhost:3000` with mock data enabled by
default (`REACT_APP_USE_MOCK=true` in `.env`), so it works with **no
backend at all**.

## توصيل Backend حقيقي (Connecting a real backend)

1. Set `REACT_APP_API_BASE_URL` in `.env` to your API's base URL.
2. Set `REACT_APP_USE_MOCK=false`.
3. Implement these three endpoints (see `src/services/invoiceService.js`
   for the exact shape each one must return):
   - `GET /invoices?page=&tab=&search=&pageSize=`
   - `GET /invoices/summary`
   - `GET /invoices/export` (returns a CSV file/blob)

## هيكل المشروع (Project structure)

```
src/
  components/
    common/      # Button, Badge, Card, Table, Pagination, SearchBar, Spinner
    layout/      # Sidebar, Navbar, AppLayout
    invoices/    # DashboardHeader, StatsGrid, StatCard, InvoiceTable, ...
  hooks/
    useInvoices.js   # search + filter + pagination state/data
  pages/
    InvoicesPage.jsx
  services/
    api.js             # axios instance (auth header, timeout, error normalization)
    invoiceService.js   # fetchInvoices / fetchInvoiceSummary / exportInvoicesCsv
    mockInvoices.js      # mock dataset used until a backend is wired up
  routes/
    AppRouter.jsx
```

## ملاحظات أمنية (Security notes)

- No API keys or secrets are hardcoded; `REACT_APP_API_BASE_URL` is
  read from environment variables and `.env` is git-ignored.
- Search input is sanitized (`sanitizeSearchTerm`) before it is used
  in any query, and length-capped.
- Axios responses are normalized through an interceptor so raw
  server errors/stack traces never reach the UI.
- A `Content-Security-Policy` meta tag restricts script/style/image
  sources in `public/index.html`.

## المميزات المطبّقة (Implemented features)

- Search (debounced, 350ms)
- Tabs: All Invoices / Pending / Paid
- Pagination with compact page-range UI
- Loading skeletons (stats cards + table rows)
- Empty state when a search/filter returns nothing
- Error state if the data request fails
- CSV export (client-side blob download)
- Fully responsive down to mobile
