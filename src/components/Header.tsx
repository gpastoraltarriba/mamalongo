import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/BoardData";
import { useAuth } from "./AuthGate";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const name = user?.displayName?.trim() || "";
  const email = user?.email || "";
  const userLabel = name ? `${name} (${email})` : email;

  const logout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const topBar: React.CSSProperties = {
    background: "#162B4A",
    color: "white",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 4px rgba(0,0,0,.2)",
  };

  const titleStyle: React.CSSProperties = { fontWeight: 700, fontSize: 24 };
  const right: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center" };
  const linkBtn: React.CSSProperties = {
    textDecoration: "none",
    padding: "8px 12px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,.4)",
    borderRadius: 6,
    color: "white",
  };
  const dangerBtn: React.CSSProperties = {
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    background: "#FF6A3D",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <header style={topBar}>
      <div style={titleStyle}>Kanban & Timesheets Lite</div>
      <div style={right}>
        <NavLink to="/" style={linkBtn}>Volver a inicio</NavLink>
        {user ? (
          <>
            <span style={{ opacity: 0.9 }}>{userLabel}</span>
            <button onClick={logout} style={dangerBtn}>Cerrar Sesión</button>
          </>
        ) : (
          <NavLink to="/login" style={linkBtn}>Iniciar sesión</NavLink>
        )}
      </div>
    </header>
  );
}
