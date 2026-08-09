import Style from './Sidebar.module.css'
import { NavLink } from 'react-router-dom'
import { useState } from 'react';
import { LayoutGrid, BookOpen, FileText, Users, Settings, LogOut, Landmark, ChevronDown, ChevronRight, Wallet, Wrench } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, path: "/Dashboard" },
  { label: "Accounting", icon: BookOpen,
    children: [
      { key: "Ledger", label: "Ledger Accounts", path: "/Dashboard/Ledger" },
      { key: "Journals", label: "Journal Headers", path: "/Dashboard/Journal" },
    ]
  },
  { label: "Invoices", icon: FileText, 
    children: [
      { key: "AP Invoices", label: "Accounts Payable ", path: "/Dashboard/AP_Invoices" },
      { key: "AR Invoices", label: "Accounts Receivable ", path: "/Dashboard/AR_Invoices" },
    ]
  },
  { label: "Clients", icon: Users, 
    children: [
      { key: "Vendors", label: "Vendors", path: "/Dashboard/Vendors" },
      { key: "Customers", label: "Customers", path: "/Dashboard/Customers" },
    ]
  },
    { label: "Payments", icon: Wallet,
    children: [
      { key: "AP", label: "AP Payments", path: "/Dashboard/AP_Payment" },
    ]
  },
  { label: "Reports", icon: FileText, path: "/Dashboard/reports" },
  { label: "User Management", icon: Users, active: true, path: "/Dashboard/users" },
  { label: "Settings", icon: Settings, path: "/Dashboard/settings" }

];

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => { setOpenMenus(prev => ({ ...prev, [label]: !prev[label] })); };

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
        {NAV_ITEMS.map((item) => {
          const isOpen = openMenus[item.label] || false;

          if (item.children && item.children.length > 0) {
            return (
              <div key={item.label} className={Style.umdropdown}>
                <div className={Style.umdropdownHeader} onClick={() => toggleMenu(item.label)}>
                  <div className={Style.umdropdownTitle}>
                    <item.icon size={17} />
                    <span>{item.label}</span>
                  </div>
                  {isOpen ? (<ChevronDown size={16} />) : (<ChevronRight size={16} />)}
                </div>

                {isOpen && (<div className={Style.umdropdownContent}>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.key || child.label}
                      to={child.path}
                      className={({ isActive }) => `${Style.umdropdownItem} ${isActive ? Style.umactive : ""}`}>
                      <span>{child.label}</span>
                    </NavLink>
                  ))}
                </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) => `${Style.umnavitem} ${isActive ? Style.umactive : ""}`}>
              <item.icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
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