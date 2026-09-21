import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMovieDetails, fetchMovieReviews, imageUrl } from "../../api/tmdb";
import "./MovieDetails.css";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    Promise.all([fetchMovieDetails(id), fetchMovieReviews(id)])
      .then(([movieData, reviewsData]) => {
        setMovie(movieData);
        setReviews(reviewsData.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movie details or reviews:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2 className="status-message">Loading movie details...</h2>;
  if (error) return <h2 className="status-message error">Error: {error}</h2>;
  if (!movie) return <h2 className="status-message">Movie not found</h2>;

  const backdrop = imageUrl(movie.backdrop_path, "original");
  const poster = imageUrl(movie.poster_path, "w500");

  return (
    <div className="movie-details-container">
      {/* خلفية الفيلم */}
      {backdrop && (
        <div className="movie-backdrop" style={{ backgroundImage: `url(${backdrop})` }}>
          <div className="backdrop-overlay"></div>
        </div>
      )}

      {/* زر العودة في أعلى المحتوى بشكل بارز */}
      <div className="movie-details-wrapper">
        <Link to="/" className="back-btn">← Back to Home</Link>

        <div className="movie-details-content">
          {poster && <img src={poster} alt={movie.title} className="movie-details-poster" />}
          
          <div className="movie-details-info">
            <h1>{movie.title}</h1>
            <p className="tagline"><em>{movie.tagline}</em></p>
            <p className="overview">{movie.overview}</p>
            
            <div className="movie-meta">
              <span>⭐ Rating: {movie.vote_average?.toFixed(1)} / 10</span>
              <span>📅 Release Date: {movie.release_date}</span>
              <span>⏱️ Runtime: {movie.runtime} mins</span>
            </div>

            <div className="genres">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="genre-badge">{genre.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* قسم مراجعات وتعليقات المستخدمين من الـ API */}
        <div className="feedback-section">
          <h2>Reviews from TMDB Users</h2>

          <div className="feedbacks-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="feedback-card">
                  <div className="feedback-header">
                    <span className="feedback-user">
                      {review.author} {review.author_details?.rating ? `(⭐ ${review.author_details.rating}/10)` : ""}
                    </span>
                    <span className="feedback-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="feedback-text">
                    {review.content.length > 350 
                      ? `${review.content.substring(0, 350)}...` 
                      : review.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-feedback">No reviews available for this movie yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}