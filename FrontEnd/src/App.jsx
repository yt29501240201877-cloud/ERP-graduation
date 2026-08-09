import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import ProtectedRoute from "./components/context/ProtectedRoute";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from "../src/pages/Login/Login"
import Layout from "../src/Layout/Layout";
import Dashboard from "../src/pages/Dashboard/Dashboard"
import Users from "../src/pages/Dashboard/users"
import New from "../src/pages/Dashboard/AddNewUser"
import Journal from "./pages/Accountant/Journal/Journal_H"
import Ledger from "./pages/Accountant/LedgerAccount"
import Details from "./pages/Accountant/Journal/InterJourn"
import Vendors from "./pages/Accountant/Clients/Vendor"
import Customers from "./pages/Accountant/Clients/Customer"
import APInvoices from "./pages/Accountant/AP_Invoices/AP_Invoice"
import AP_Lines from "./pages/Accountant/AP_Invoices/AP_InvoiceLine"
import APPayment from "./pages/Accountant/AP_Invoices/AccountsPayablePayment"
import ARInvoices from "./pages/Accountant/AR_Invoices/AR_Invoices"
import ARReceipts from "./pages/Accountant/AR_Invoices/AR_Receipts"
import './App.css'

const router = createBrowserRouter([
  { path: '/', element: <Login/> },
  { path: 'Dashboard',   element: <Layout/> ,
      children: [
        {index: true, element: <Dashboard/>},
        {path: 'users', element: <Users/>},
        {path: 'New', element: <New/>},
        {path: 'Ledger', element: <Ledger/>},
        {path: 'Journal', element: <Journal/>},
        {path: 'Details', element: <Details/>},
        {path: 'Vendors', element: <Vendors/>},
        {path: 'Customers', element: <Customers/>},
        {path: 'AP_Invoices', element: <APInvoices/>},
        {path: 'AP_Lines/:id', element: <AP_Lines/>},
        {path: 'AP_Payment', element: <APPayment/>},
        {path: 'AR_Invoices', element: <ARInvoices/>},
        {path: 'AR_Receipts/:id', element: <ARReceipts/>},
      ]
  },
])



function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
