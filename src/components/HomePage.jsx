import { useEffect, useState } from "react";
import "./Design/HomePage.css";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZGJlYzY5OTRhYWJiMDcxYjc1ODlkMWFkNTI0YjQ4YSIsIm5iZiI6MTc4OTkyMTY0MC4yNDg5OTk4LCJzdWIiOiI2YWIwMDk2ODUxYTg1ZWIzZTA0YzhiOWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.izblZEP668jKD3lGxrp2xPPIMpWx6dLcY6aZmxRMVkc";

  const imageUrl = (path, size = "w500") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${currentPage}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch movies: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });
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
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img 
              src={imageUrl(movie.poster_path, "w500")} 
              alt={movie.title} 
              className="movie-poster"
            />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-rating">⭐ Rating: {movie.vote_average?.toFixed(1)} / 10</p>
            </div>
          </div>
        ))}
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