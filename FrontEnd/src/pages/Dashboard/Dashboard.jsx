import Style from "./Dashboard.module.css"
import { useState, useEffect } from "react";
import { ChevronRight, Info, AlertTriangle, AlertCircle, LogIn, Rocket, Anchor, Layers, Cpu, MemoryStick, Database, Users } from "lucide-react";

const METRICS = [
  { label: "CPU Usage", value: "42.8%", tag: "OPTIMAL", tone: Style.shtagok, icon: Cpu, bars: [3, 5, 4, 6, 5, 7, 6], barTone: Style.shbargreen },
  { label: "Memory Consumption", value: "14.2 GB", tag: "WARNING", tone: Style.shtagwarn, icon: MemoryStick, bars: [5, 6, 8, 7, 9, 8, 7], barTone: Style.shbaramber },
  { label: "Database Latency", value: "12ms", tag: "OPTIMAL", tone: Style.shtagok, icon: Database, bars: [2, 2, 3, 2, 2, 3, 2], barTone: Style.shbargreen, dotted: true },
  { label: "Active Sessions", value: "1,204", tag: "OPTIMAL", tone: Style.shtagok, icon: Users, bars: [4, 5, 6, 5, 7, 6, 8], barTone: Style.shbarblue },
];

const EVENTS = [
  { type: "Brute Force Attempt", icon: AlertTriangle, iconTone: Style.shiconrose, ip: "192.168.1.104", user: "j.smith (Locked)", time: "2 mins ago", action: "Block IP" },
  { type: "Admin Privilege Esc.", icon: AlertCircle, iconTone: Style.shiconamber, ip: "10.0.4.52", user: "Service_Acc_PRD", time: "14 mins ago", action: "Review" },
  { type: "New Geo-Location", icon: LogIn, iconTone: Style.shiconblue, ip: "204.14.3.1", user: "m.rahul", time: "1 hour ago", action: "Verify" },
];

const ENVIRONMENTS = [
  { name: "Production", version: "Version: 2.4.1 (Stable)", icon: Rocket, actions: ["Flush Cache", "Update Logs"] },
  { name: "Staging", version: "Version: 2.5.0-RC1", icon: Anchor, actions: ["Deploy"] },
  { name: "Sandbox", version: "Personal Dev Instances (4)", icon: Layers, actions: ["Reset"] },
];

const VOLUME = [
  { label: "00:00", value: 44 },
  { label: "", value: 52 },
  { label: "06:00", value: 38 },
  { label: "", value: 58 },
  { label: "12:00", value: 62 },
  { label: "", value: 46 },
  { label: "18:00", value: 50 },
  { label: "NOW", value: 70, active: true },
];

export default function Dashboard() {
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 8 : c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className={Style.shcontent}>
      <div className={Style.shbreadcrumb}>
        <span>Dashboard</span>
        <ChevronRight size={13} />
        <b>System Health Overview</b>
      </div>

      <div className={Style.shsectionhead}>
        <h1 className={Style.shsectiontitle}>Flugur System Health</h1>
        <div className={Style.shrefreshnote}>Auto-refresh in {countdown}s</div>
      </div>

      <div className={Style.shmetricsgrid}>
        {METRICS.map((m) => (
          <div key={m.label} className={Style.shmetriccard}>
            <div className={Style.shmetrictop}>
              <div className={Style.shmetriclabel}><m.icon size={13} /> {m.label}</div>
              <span className={`${Style.shtag} ${m.tone}`}>{m.tag}</span>
            </div>
            <div className={Style.shmetricbottom}>
              <div className={Style.shmetricvalue}>{m.value}</div>
              <div className={`${Style.shbars} ${m.dotted ? Style.shdotted : ""}`}>
                {m.bars.map((h, i) => (
                  <div key={i} className={`${Style.shbar} ${m.barTone}`} style={{ height: `${h * 3}px` }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={Style.shrow2col}>
        <div className={Style.shcard}>
          <div className={Style.shcardhead}>
            <span className={Style.shcardtitle}>License &amp; Usage</span>
            <Info size={16} className={Style.shinfoicon} />
          </div>

          <div className={Style.shseatsrow}>
            <span className={Style.shseatslabel}>Total Enterprise Seats</span>
            <span className={Style.shseatsvalue}>850 / 1000</span>
          </div>
          <div className={Style.shprogresstrack}>
            <div className={Style.shprogressfill} style={{ width: "85%" }} />
          </div>
          <div className={Style.shseatsnote}>You have 150 available seats left in your current tier.</div>

          <div className={Style.shrenewalbox}>
            <div>
              <div className={Style.shrenewallabel}>UPCOMING RENEWAL</div>
              <span className={Style.shrenewaldate}>Oct 24, 2024</span>
              <span className={Style.shrenewaldays}>32 Days Remaining</span>
            </div>
          </div>

          <button className={Style.shbtnoutline}>Manage Subscriptions</button>
        </div>

        <div className={Style.shcard}>
          <div className={Style.shcardhead}>
            <span className={Style.shcardtitle}>Security &amp; Access Events</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className={Style.shcriticalchip}>2 CRITICAL</span>
              <button className={Style.shviewall}>VIEW ALL</button>
            </div>
          </div>

          <table className={Style.sheventstable}>
            <thead className={Style.sheventsthead}>
              <tr>
                <th>Event Type</th>
                <th>Source IP</th>
                <th>User/System</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {EVENTS.map((e) => (
                <tr key={e.type} className={Style.sheventsrow}>
                  <td>
                    <div className={Style.sheventtype}>
                      <e.icon size={15} className={e.iconTone} />
                      {e.type}
                    </div>
                  </td>
                  <td className={Style.sheventmeta}>{e.ip}</td>
                  <td className={Style.sheventmeta}>{e.user}</td>
                  <td className={Style.sheventmeta}>{e.time}</td>
                  <td><button className={Style.sheventaction}>{e.action}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={Style.shrow2col}>
        <div className={Style.shcard}>
          <div className={Style.shcardhead}>
            <span className={Style.shcardtitle}>Environment Management</span>
          </div>
          <div className={Style.shenvlist}>
            {ENVIRONMENTS.map((env) => (
              <div key={env.name} className={Style.shenvrow}>
                <div className={Style.shenvleft}>
                  <div className={`${Style.shenvicon} ${env.name === "Production" ? Style.shenvprod : env.name === "Staging" ? Style.shenvstage : Style.shenvsandbox}`}>
                    <env.icon size={18} />
                  </div>
                  <div>
                    <div className={Style.shenvname}>{env.name}</div>
                    <div className={Style.shenvversion}>{env.version}</div>
                  </div>
                </div>
                <div className={Style.shenvactions}>
                  {env.actions.map((a) => (
                    <button key={a} className={Style.shenvbtn}>{a}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={Style.shcard}>
          <div className={Style.shcardhead}>
            <span className={Style.shcardtitle}>API Ecosystem Performance</span>
            <span className={Style.shapilink}>LAST 24H</span>
          </div>

          <div className={Style.shapistats}>
            <div className={Style.shapistatbox}>
              <div className={Style.shapistatlabel}>Success Rate</div>
              <div className={`${Style.shapistatvalue} ${Style.shsuccessvalue}`}>99.98%</div>
              <div className={Style.shsuccessunderline} />
            </div>
            <div className={Style.shapistatbox}>
              <div className={Style.shapistatlabel}>Total Requests</div>
              <div className={Style.shapistatvalue}>2.4M</div>
              <div className={Style.shapidelta}>+12% from yesterday</div>
            </div>
          </div>

          <div className={Style.shchartwrap}>
            <div className={Style.shchartvlabel}>Volume</div>
            <div className={Style.shchart}>
              {VOLUME.map((v, i) => (
                <div key={i} className={Style.shchartcol}>
                  <div
                    className={`${Style.shchartbar} ${v.active ? Style.shchartactive : ""}`}
                    style={{ height: `${v.value}%` }}
                  />
                  <div className={Style.shchartlabel}>{v.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


