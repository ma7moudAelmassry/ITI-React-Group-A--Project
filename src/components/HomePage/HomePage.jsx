import { useEffect, useState } from "react";
import { fetchNowPlaying, imageUrl } from "../../api/tmdb";
import "./HomePage.css";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchNowPlaying(currentPage)
      .then((data) => {
        if (cancelled) return;
        setMovies(data.results || []);
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
  }, [currentPage]);

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
    return <h2 className="status-message">Loading movies...</h2>;
  }

  if (error) {
    return <h2 className="status-message error">Error: {error}</h2>;
  }

  return (
    <div className="home-container">
      <h1 className="section-title">Now Playing Movies</h1>
      
      <div className="movies-grid">
        {movies.map((movie) => {
          const poster = imageUrl(movie.poster_path, "w500");
          return (
          <div key={movie.id} className="movie-card">
            {poster ? (
              <img
                src={poster}
                alt={movie.title}
                className="movie-poster"
              />
            ) : (
              <div className="movie-poster movie-poster-fallback" aria-hidden="true">
                No poster
              </div>
            )}
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-rating">⭐ Rating: {movie.vote_average?.toFixed(1)} / 10</p>
            </div>
          </div>
          );
        })}
      </div>

    
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
    </div>
  );
}