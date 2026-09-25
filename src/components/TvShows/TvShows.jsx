import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchTvOnTheAir, fetchSearchTv, imageUrl } from "../../api/tmdb";
import "./TvShows.css";

function HeartIcon({ filled }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "#e50914" : "none"}
      stroke={filled ? "#e50914" : "currentColor"}
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export default function TvShows() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [wishlist, setWishlist] = useState([]);

  const getCurrentUserWishlistKey = () => {
    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    return currentUser ? `wishlist_${currentUser.email}` : "wishlist_guest";
  };

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem(getCurrentUserWishlistKey())) || [];
    setWishlist(savedWishlist);
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

  const toggleWishlist = (e, show) => {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    if (!currentUser) {
      showSwatToast("Please log in first to add TV shows to your wishlist!", "warning");
      return;
    }

    const key = getCurrentUserWishlistKey();
    let updatedWishlist = [...wishlist];

    // ملحوظة: مسلسلات TV بيكون اسمها show.name مش show.title
    const showItem = { ...show, title: show.name }; 
    const exists = updatedWishlist.some((item) => item.id === show.id);
    const showTitle = show.name || "TV Show";

    if (exists) {
      updatedWishlist = updatedWishlist.filter((item) => item.id !== show.id);
      showSwatToast(`Removed "${showTitle}" from wishlist`, "error");
    } else {
      updatedWishlist.push(showItem);
      showSwatToast(`Added "${showTitle}" to wishlist`, "success");
    }

    setWishlist(updatedWishlist);
    localStorage.setItem(key, JSON.stringify(updatedWishlist));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    const apiCall = query
      ? fetchSearchTv(query, currentPage)
      : fetchTvOnTheAir(currentPage);

    apiCall
      .then((data) => {
        if (cancelled) return;
        setShows(data.results || []);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentPage, query]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return <h2 className="status-message">Loading TV shows...</h2>;
  }

  if (error) {
    return <h2 className="status-message error">Error: {error}</h2>;
  }

  return (
    <div className="tv-container">
      {query && <h2 className="search-heading">Search results for: "{query}"</h2>}

      <div className="tv-grid">
        {shows.length > 0 ? (
          shows.map((show) => {
            const poster = imageUrl(show.poster_path, "w500");
            const isWishlisted = wishlist.some((item) => item.id === show.id);

            return (
              <Link
                to={`/tv/${show.id}`}
                key={show.id}
                className="tv-card-link"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="tv-card" style={{ position: "relative" }}>
                  <button
                    onClick={(e) => toggleWishlist(e, show)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(0, 0, 0, 0.6)",
                      border: "none",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 2,
                      transition: "transform 0.2s"
                    }}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <HeartIcon filled={isWishlisted} />
                  </button>

                  {poster ? (
                    <img
                      src={poster}
                      alt={show.name}
                      className="tv-poster"
                    />
                  ) : (
                    <div className="tv-poster tv-poster-fallback" aria-hidden="true">
                      No poster
                    </div>
                  )}
                  <div className="tv-info">
                    <h3 className="tv-title">{show.name}</h3>
                    <p className="tv-rating">⭐ Rating: {show.vote_average?.toFixed(1)} / 10</p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="status-message">No TV shows found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Prev
          </button>

          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`pagination-btn ${currentPage === number ? "active" : ""}`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}