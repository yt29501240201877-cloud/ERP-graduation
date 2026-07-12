import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from "../src/pages/Login/Login"
import Dashboard from "../src/pages/Dashboard/Dashboard"
import Users from "../src/pages/Dashboard/users"
import New from "../src/pages/Dashboard/AddNewUser"
import './App.css'
import JournalHeaders from './pages/Dashboard/LedgerPro';
import FlugurEnt from './pages/Dashboard/InterJourn'

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  {
    path: 'Dashboard', element: <Dashboard />,
    children: [
      { path: 'users', element: <Users /> },
      { path: 'New', element: <New /> },
      { path: 'Journal_H', element: <JournalHeaders /> },
      { path: 'Flugur_Ent', element: <FlugurEnt /> }
    ]
  },
])



function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
