import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, List, LogOut, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ taskCount, open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className={open ? "sidebar open" : "sidebar"}>
      <div className="sidebar-logo"><span className="logo-box"><Check size={14} /></span>TaskFlow<span className="dot">.</span></div>
      <p className="sidebar-label">Workspace</p>
      <nav>
        <NavLink to="/dashboard" onClick={onClose}><LayoutGrid size={14} /> Dashboard</NavLink>
        <NavLink to="/tasks" onClick={onClose}><List size={14} /> All Tasks <span className="nav-count">{taskCount}</span></NavLink>
      </nav>
      <div className="sidebar-bottom">
        <p className="sidebar-note"><strong>A little less on your mind.</strong>A little more room to focus.</p>
        <button className="logout" onClick={handleLogout}><LogOut size={15} /> Log out</button>
      </div>
    </aside>
  );
}
