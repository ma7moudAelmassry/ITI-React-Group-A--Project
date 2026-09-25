import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import SearchBar from "./SearchBar";
import "./Navbar.css";

function HeartIcon({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export default function Navbar({ wishlistCount = 0 }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  
  const showSwatToast = (msg, iconType) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: iconType,
      title: msg,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: "#172322",
      color: "#eef4f3",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("current_user");
    setCurrentUser(null);
    
    
    showSwatToast("Logged out successfully!", "success");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };
          
  const isMovies =
    pathname === "/" || pathname.startsWith("/movie") || pathname.startsWith("/search");
  const isTv = pathname.startsWith("/tv");
  const isWishlist = pathname.startsWith("/wishlist");

  const cls = (active) => (active ? "fk-link is-active" : "fk-link");
  const current = (active) => (active ? "page" : undefined);

  return (
    <header className="fk-navbar">
      <div className="fk-navbar-inner">
        <Link to="/" className="fk-brand">
          Filmk
        </Link>

        <button
          className="fk-burger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`fk-collapse ${open ? "is-open" : ""}`} onClick={() => setOpen(false)}>
          <nav className="fk-links">
            <Link to="/" className={cls(isMovies)} aria-current={current(isMovies)}>
              Movies
            </Link>
            <Link to="/tv" className={cls(isTv)} aria-current={current(isTv)}>
              TV shows
            </Link>
            <Link to="/wishlist" className={cls(isWishlist)} aria-current={current(isWishlist)}>
              <HeartIcon />
              Wishlist
             
            </Link>
          </nav>

          <SearchBar onSearchSubmit={() => setOpen(false)} />

          <div className="fk-auth">
            {currentUser ? (
              <>
                <span className="fk-hello">Hi, {currentUser.name?.split(" ")[0]}</span>
                
                <button onClick={handleLogout} className="fk-btn fk-btn-ghost">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="fk-btn fk-btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="fk-btn fk-btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}