import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ page, onMenu }) {
  const { user } = useAuth();
  const name = user?.name || "Guest";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="navbar">
      <button className="menu-btn" aria-label="Open menu" onClick={onMenu}><Menu size={18} /></button>
      <p className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></p>
      <div className="user">
        <span className="avatar">{initials}</span>
        <div><p>{name}</p><small>Personal workspace</small></div>
      </div>
    </header>
  );
}
