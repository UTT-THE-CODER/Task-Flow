import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ page, taskCount, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar taskCount={taskCount} open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}
      <div className="main">
        <Navbar page={page} onMenu={() => setMenuOpen(true)} />
        <div className="content">
          {children}
          <footer className="footer">
            <span>TaskFlow — A quiet space to organize your work.</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
