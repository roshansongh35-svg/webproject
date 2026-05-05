import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { List, X, ArrowUpRight } from "@phosphor-icons/react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/data", label: "Data" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      data-testid="navbar"
      className="sticky top-0 z-40 bg-white border-b border-zinc-200"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2">
          <span className="w-7 h-7 bg-[#09090b] text-white grid place-items-center font-mono-tech text-xs">
            A
          </span>
          <span className="font-display font-extrabold tracking-tight text-lg">ARKIV</span>
          <span className="hidden sm:inline font-mono-tech text-[10px] tracking-[0.22em] text-zinc-500 ml-2">
            / REG. 2026
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `arkiv-link font-mono-tech text-[12px] tracking-[0.16em] uppercase ${
                  isActive ? "active" : ""
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user && typeof user === "object" ? (
            <>
              <span
                data-testid="navbar-user-email"
                className="font-mono-tech text-[11px] tracking-[0.16em] text-zinc-500"
              >
                {user.email}
              </span>
              <button
                data-testid="navbar-logout-btn"
                onClick={handleLogout}
                className="arkiv-btn arkiv-btn-outline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              data-testid="navbar-login-btn"
              className="arkiv-btn"
            >
              Login
              <ArrowUpRight size={14} weight="bold" />
            </Link>
          )}
        </div>

        <button
          data-testid="navbar-menu-toggle"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-200 bg-white">
          <div className="flex flex-col">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                data-testid={`nav-mobile-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `px-6 py-4 border-b border-zinc-200 font-mono-tech text-xs tracking-[0.2em] uppercase ${
                    isActive ? "text-[#002FA7]" : "text-zinc-900"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="px-6 py-4">
              {user && typeof user === "object" ? (
                <button
                  data-testid="navbar-mobile-logout"
                  onClick={handleLogout}
                  className="arkiv-btn arkiv-btn-outline w-full"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="arkiv-btn w-full">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
