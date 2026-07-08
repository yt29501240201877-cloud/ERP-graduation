import Sidebar from "../../components/Sidebar/Sidebar"
import Topbar from "../../components/Topbar/Topbar"
import Style from "./Dashboard.module.css"
import { Outlet } from "react-router-dom"




export default function Dashboard() {
  return (

    // <div className={Style.body}>
    //   <div className={Style.app}>
    //     <Sidebar/>
    //       <div className={Style.main}>
    //         <Topbar/>
    //         <Outlet/>        
    //       </div>
    //   </div> 
    // </div>

    <div className={Style.umpage}>
        <Sidebar />
      <div className={Style.ummain}>
        <Topbar />
        <Outlet />
      </div>
    </div>



  )
}


