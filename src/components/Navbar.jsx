import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./Design/Navbar.css";


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

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function Navbar({ wishlistCount = 0, user = null, onLogout }) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

         
  const isMovies =
    pathname === "/" || pathname.startsWith("/movie") || pathname.startsWith("/search");
  const isTv = pathname.startsWith("/tv");
  const isWishlist = pathname.startsWith("/wishlist");

  const cls = (active) => (active ? "fk-link is-active" : "fk-link");
  const current = (active) => (active ? "page" : undefined);

  const handleSearch = (e) => {
    e.preventDefault();
    const nextQuery = query.trim();
    if (!nextQuery) return;
    navigate(`/search?query=${encodeURIComponent(nextQuery)}`);
    setOpen(false);
  };


  useEffect(() => {
    setOpen(false);
    setQuery(pathname === "/search" ? searchParams.get("query") || "" : "");
  }, [pathname, searchParams]);

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
              <HeartIcon filled={wishlistCount > 0} />
              Wishlist
              <span className="fk-count" aria-label={`${wishlistCount} items in wishlist`}>
                {wishlistCount}
              </span>
            </Link>
          </nav>

  
          <form
            className="fk-search"
            role="search"
            onSubmit={handleSearch}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="search"
              name="query"
              placeholder="Search movies"
              aria-label="Search movies"
              required
              pattern=".*\S.*"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>
          </form>

          <div className="fk-auth">
            {user ? (
              <>
                <span className="fk-hello">Hi, {user.name?.split(" ")[0]}</span>
                <Link to="/" className="fk-btn fk-btn-ghost" onClick={onLogout}>
                  Log out
                </Link>
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