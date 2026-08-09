import NotificationBell from '../NotificationBell/NotificationBell';
import Style from './Topbar.module.css'
import { Search, HelpCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className={Style.umtopbar}>
      <div className={Style.umsearchwrap}>
        <Search size={16} className={Style.umsearchicon}/>
        <input className={Style.umsearchinput} placeholder="Global search for transactions, users, or accounts..."/>
      </div>
      <div className={Style.umtopactions}>
        <div className={Style.umiconbtn}>
          <NotificationBell />
        </div>
        <HelpCircle size={18} className={Style.umiconbtn}/>
        <div className={Style.umdividerv}/>
        <div className={Style.umstatuswrap}>
          System Status:
          <span className={Style.umstatuspill}>
            <span className={Style.umstatusdot}/>
            OPERATIONAL
          </span>
        </div>
      </div>
    </header>
  )
}
