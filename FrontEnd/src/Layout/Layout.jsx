import Sidebar from "../components/Sidebar/Sidebar"
import Topbar from "../components/Topbar/Topbar"
import Style from "./Layout.module.css"
import { Outlet } from "react-router"

export default function Layout() {
    return (
        <div className={Style.umpage}>
            <Sidebar />
            <div className={Style.ummain}>
                <Topbar />
                <Outlet />
            </div>
        </div>
    )
}
