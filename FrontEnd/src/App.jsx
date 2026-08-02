import { createBrowserRouter, RouterProvider } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from "../src/pages/Login/Login"
import Dashboard from "../src/pages/Dashboard/Dashboard"
import Users from "../src/pages/Dashboard/users"
import New from "../src/pages/Dashboard/AddNewUser"
import InvoiceLines from './pages/InvoiceLines/InvoiceLines';
import './App.css'
import GeneralLedger from './pages/GeneralLedger/GeneralLedger';

// const router = createBrowserRouter([
//   // { path: '/', element: <Login/> },
//   { path: 'Dashboard', element: <Dashboard/> ,
//       children: [
//   //       {path: 'users', element: <Users/>},
//   //       {path: 'New', element: <New/>}
//           
//       ]
import JournalHeaders from './pages/Dashboard/LedgerPro';
import FlugurEnt from './pages/Dashboard/InterJourn';
import AccountsPayable from './pages/AccountsPayable/AccountsPayable';
import ApInvoice from './pages/ApInvoice/ApInvoice';
import CreateInvoice from './pages/CreateInvoice/CreateInvoice';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  {
    path: 'Dashboard', element: <Dashboard />,
    children: [
      {path: "AccountsPayable", element: <AccountsPayable />},
      {path: "ApInvoice", element: <ApInvoice /> },
      {path: "CreateInvoice", element: <CreateInvoice />},
      {path: "InvoiceLines", element: <InvoiceLines /> },
      { path: 'users', element: <Users /> },
      { path: 'New', element: <New /> },
      { path: 'Journal_H', element: <JournalHeaders /> },
      { path: 'Flugur_Ent', element: <FlugurEnt /> },
      {path: "generalLedger", element: <GeneralLedger/>}
    ]
  },
])



function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
