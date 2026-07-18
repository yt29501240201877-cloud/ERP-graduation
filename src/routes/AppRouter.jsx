import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import InvoicesPage from "../pages/InvoicesPage";
import PaymentsPage from "../pages/PaymentsPage";
import CreateInvoicePage from "../pages/CreateInvoicePage";
import InvoiceLinesPage from "../pages/InvoiceLinesPage";

/**
 * Central route table. New pages (Payments, Customers, Revenue Reports...)
 * should be added here as sibling <Route> entries inside AppLayout.
 */
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/invoices" replace />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoices/new" element={<CreateInvoicePage />} />
          <Route path="invoices/:invoiceId/lines" element={<InvoiceLinesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          {/* Future routes: customers, revenue-reports, settings */}
          <Route path="*" element={<Navigate to="/invoices" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
