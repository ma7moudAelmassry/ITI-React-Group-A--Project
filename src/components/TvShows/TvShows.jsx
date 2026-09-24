import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchTvOnTheAir, fetchSearchTv, imageUrl } from "../../api/tmdb";
import "./TvShows.css";

export default function TvShows() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
            return (
              <Link
                to={`/tv/${show.id}`}
                key={show.id}
                className="tv-card-link"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="tv-card">
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
