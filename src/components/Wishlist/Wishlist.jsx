import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { imageUrl } from "../../api/tmdb";
import "./Wishlist.css";

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

export default function Wishlist() {
  const [wishlistMovies, setWishlistMovies] = useState([]);

  const getCurrentUserWishlistKey = () => {
    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    return currentUser ? `wishlist_${currentUser.email}` : "wishlist_guest";
  };

  useEffect(() => {
    const key = getCurrentUserWishlistKey();
    const savedWishlist = JSON.parse(localStorage.getItem(key)) || [];
    setWishlistMovies(savedWishlist);
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

  const removeFromWishlist = (e, movie) => {
    e.preventDefault();
    const key = getCurrentUserWishlistKey();
    const updatedWishlist = wishlistMovies.filter((item) => item.id !== movie.id);
    
    setWishlistMovies(updatedWishlist);
    localStorage.setItem(key, JSON.stringify(updatedWishlist));
    
    showSwatToast(`Removed "${movie.title || "Movie"}" from wishlist`, "error");
  };

  return (
    <div className="fk-wishlist-page">
      <div className="fk-container">
        <h2 className="fk-page-title">My Wishlist ❤️</h2>

        {wishlistMovies.length > 0 ? (
          <div className="fk-movies-grid">
            {wishlistMovies.map((movie) => {
              const poster = imageUrl(movie.poster_path, "w500");

              return (
                <Link 
                  to={`/movie/${movie.id}`} 
                  key={movie.id} 
                  className="fk-movie-card-link"
                >
                  <div className="fk-movie-card">
                    <button
                      onClick={(e) => removeFromWishlist(e, movie)}
                      className="fk-wishlist-heart-btn"
                      title="Remove from wishlist"
                    >
                      <HeartIcon filled={true} />
                    </button>

                    {poster ? (
                      <img src={poster} alt={movie.title} />
                    ) : (
                      <div className="fk-movie-fallback">
                        No poster
                      </div>
                    )}

                    <div className="fk-movie-info">
                      <div>
                        <h3>{movie.title}</h3>
                        <p className="fk-movie-rating">
                          ⭐ Rating: {movie.vote_average?.toFixed(1)} / 10
                        </p>
                      </div>
                      
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="fk-empty-state">
            <p>Your wishlist is empty. Go add some movies! 🎬</p>
            <Link to="/" className="fk-btn fk-btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Explore Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}