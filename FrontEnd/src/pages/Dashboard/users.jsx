import { useState, useEffect } from "react";
// import { UseAuth } from '../../components/context/authContext'
// import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import Style from "./users.module.css"
import api from '../../components/api';
import { Users,Plus,Filter,ChevronDown,Download,Pencil,RotateCcw,MoreVertical,ChevronLeft,ChevronRight,Lock,Mail,Zap} from "lucide-react";

const ROLE_CLASS = {
  Admin: `${Style.umrole} ${Style.umroleadmin}`,
  Accountant: `${Style.umrole} ${Style.umRoleAccountant}`,
  "Procurment Manager": `${Style.umrole} ${Style.umRoleManager}`,
  "Financial Manger": `${Style.umrole} ${Style.umRoleEmployee}`,
};

const is_active = {
  Active: `${Style.umstatus} ${Style.umstatusactive}`,
  Pending: `${Style.umstatus} ${Style.umstatuspending}`,
  Inactive: `${Style.umstatus} ${Style.umstatusinactive}`,
};

const STATS = [
  { label: "Total Users", value: "1,284", icon: Users, toneClass: Style.umBlue },
  { label: "Active Now", value: "342", icon: Zap, toneClass: Style.umGreen },
  { label: "Pending Invites", value: "12", icon: Mail, toneClass: Style.umAmber }, 
  { label: "Access Requests", value: "5", icon: Lock, toneClass: Style.umRose, highlight: true },
];

export default function UserManagementDark() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setEmployees] = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await api.get("/dashboard/users");
        setEmployees(res.data.user);
      } catch (err) {
        console.log(err);
        // showToast('Failed to fetch employees');
      }
    };
    getEmployees();
  }, []);

  const toggleAll = (checked) => setSelected(checked ? user.map((u) => u.id) : []);
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const filtered = user.filter(
    (u) =>
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) 
      // u.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
        <main className={Style.umcontent}>
          <div className={Style.umpagehead}>
            <div>
              <h1 className={Style.umpagetitle}>User Management</h1>
              <p className={Style.umpagesub}>Manage organization access, roles, and security permissions.</p>
            </div>
            <NavLink to="/Dashboard/New" className={Style.umLink}>
            <button className={Style.umaddbtn}>
              <Plus size={16} />
              Add New User
            </button>
            </NavLink>
          </div>

          <div className={Style.umstatsgrid}>
            {STATS.map((s) => (
              <div key={s.label} className={Style.umstatcard}>
                <div>
                  <div className={Style.umstatlabel}>{s.label}</div>
                  <div className={`${Style.umstatvalue} ${s.highlight ? Style.umhighlight : ""}`}>{s.value}</div>
                </div>
                <s.icon size={20} className={s.toneClass} />
              </div>
            ))}
          </div>

          <div className={Style.umfilterbar}>
            <div className={Style.umfiltersearch}>
              <Filter size={15} className={Style.umfiltericon} />
              <input className={Style.umfilterinput} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by name, email or department..."/>
            </div>
            <button className={Style.umfilterbtn}>All Roles <ChevronDown size={14} /></button>
            <button className={Style.umfilterbtn}>All Statuses <ChevronDown size={14} /></button>
            <button className={Style.umfilterbtn}><Download size={15} /> Export</button>
          </div>

          <div className={Style.umtablecard}>
            <table className={Style.umtable}>
              <thead>
                <tr className={Style.umtheadrow}>
                  <th className={`${Style.umth} ${Style.umthfirst}`}>
                    <input type="checkbox" className={Style.umcheckbox}
                      checked={selected.length === user.length} onChange={(e) => toggleAll(e.target.checked)}/>
                  </th>
                  <th className={Style.umth}>Name &amp; Email</th>
                  <th className={Style.umth}>Role</th>
                  <th className={Style.umth}>Status</th>
                  <th className={Style.umth}>Last Login</th>
                  <th className={`${Style.umtd} ${Style.umthlast}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  console.log(u.image),
                  <tr key={u.id} className={Style.umrow}>
                    <td className={`${Style.umtd} ${Style.umtdfirst}`}>
                      <input type="checkbox" className={Style.umcheckbox} checked={selected.includes(u._id)} onChange={() => toggleOne(u._id)}/>
                    </td>
                    <td className={Style.umtd}>
                      <div className={Style.umusercell}>
                        <div className={`${Style.umavatar} ${u.avatarClass}`}>
                            <img src={`http://localhost:4000/${u.image} `} alt={u.name} className={Style.umavatar}/>
                          </div>
                        <div>
                          <div className={Style.umusernamecell}>{u.first_name} {u.last_name}</div>
                          <div className={Style.umuseremailcell}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className={Style.umtd}>
                      <span className={ROLE_CLASS[u.role]}>{u.role}</span>
                    </td>
                    <td className={Style.umtd}>
                      <span className={is_active[u.is_active]}>{u.is_active}</span>
                    </td>
                    <td className={`${Style.umtd} ${Style.umlogincell}`}>{u.last_login}</td>
                    <td className={`${Style.umtd} ${Style.umtdlast}`}>
                      <div className={Style.umactionscell}>
                        <Pencil size={15} className={Style.umactionicon}/>
                        <RotateCcw size={15} className={Style.umactionicon}/>
                        <MoreVertical size={15} className={Style.umactionicon}/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={Style.umtablefooter}>
              <div className={Style.umshowingtext}>
                Showing <b>1 - 5</b> of <b>1,284</b> users
              </div>
              <div className={Style.umpagination}>
                <button className={Style.umpagebtn}><ChevronLeft size={15} /></button>
                <button className={`${Style.umpagebtn} ${Style.umpageactive}`}>1</button>
                <button className={Style.umpagebtn}>2</button>
                <button className={Style.umpagebtn}>3</button>
                <span className={Style.umpageellipsis}>...</span>
                <button className={Style.umpagebtn}>257</button>
                <button className={Style.umpagebtn}><ChevronRight size={15} /></button>
              </div>
            </div>
          </div>

          {/* <div className="um-audit-note">
            <Info size={13} />
            Data integrity audit logged at 2023-11-24 14:02:15 UTC. All administrative actions are recorded in the system audit trail.
          </div> */}
        </main>
  );
}
