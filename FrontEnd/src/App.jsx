import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from "../src/pages/Login/Login"
import Dashboard from "../src/pages/Dashboard/Dashboard"
import Users from "../src/pages/Dashboard/users"
import New from "../src/pages/Dashboard/AddNewUser"
import './App.css'

const router = createBrowserRouter([
  { path: '/', element: <Login/> },
  { path: 'Dashboard',   element: <Dashboard/> ,
      children: [
        {path: 'users', element: <Users/>},
        {path: 'New', element: <New/>}
      ]
  },
])



function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
