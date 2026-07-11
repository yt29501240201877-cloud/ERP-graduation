import Style from './Sidebar.module.css'
import { NavLink } from 'react-router-dom'
import { LayoutGrid, BookOpen, FileText, Users, Settings, LogOut, Landmark } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, path: "/Dashboard" },
  { label: "Accounting", icon: BookOpen },
  { label: "Reports", icon: FileText },
  { label: "User Management", icon: Users, active: true, path: "/Dashboard/users" },
  { label: "Settings", icon: Settings },
];


export default function Sidebar() {
  return (
    <aside className={Style.umsidebar}>
      <div className={Style.umbrand}>
        <div className={Style.umbrandmark}>
          <Landmark size={18} color="#020617" />
        </div>
        <div>
          <div className={Style.umbrandname}>Flugur ERP</div>
          <div className={Style.umbrandtag}>PRECISION LEDGER</div>
        </div>
      </div>

      <nav className={Style.umnav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `${Style.umnavitem} ${isActive ? Style.umactive : ""}`
            }
          >
            <item.icon size={17} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={Style.umsidebarfooter}>
        <div className={Style.umusermini}>
          <div className={Style.umuseravatar} />
          <div>
            <div className={Style.umusername}>David Miller</div>
            <div className={Style.umuserrole}>Super Admin</div>
          </div>
        </div>
        <LogOut size={16} className={Style.umlogout} />
      </div>
    </aside>
  )
}





