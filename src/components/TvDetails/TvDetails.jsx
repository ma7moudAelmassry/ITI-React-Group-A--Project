import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTvDetails, fetchTvReviews, imageUrl } from "../../api/tmdb";
import "./TvDetails.css";

export default function TvDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    Promise.all([fetchTvDetails(id), fetchTvReviews(id)])
      .then(([showData, reviewsData]) => {
        setShow(showData);
        setReviews(reviewsData.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching TV details or reviews:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2 className="status-message">Loading TV show details...</h2>;
  if (error) return <h2 className="status-message error">Error: {error}</h2>;
  if (!show) return <h2 className="status-message">TV show not found</h2>;

  const backdrop = imageUrl(show.backdrop_path, "original");
  const poster = imageUrl(show.poster_path, "w500");

  return (
    <div className="tv-details-container">

      {backdrop && (
        <div className="tv-backdrop" style={{ backgroundImage: `url(${backdrop})` }}>
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="tv-details-wrapper">
        <Link to="/tv" className="back-btn">← Back to TV Shows</Link>

        <div className="tv-details-content">
          {poster && <img src={poster} alt={show.name} className="tv-details-poster" />}

          <div className="tv-details-info">
            <h1>{show.name}</h1>
            <p className="tagline"><em>{show.tagline}</em></p>
            <p className="overview">{show.overview}</p>

            <div className="tv-meta">
              <span>⭐ Rating: {show.vote_average?.toFixed(1)} / 10</span>
              <span>📅 First Air Date: {show.first_air_date}</span>
              <span>📺 Seasons: {show.number_of_seasons}</span>
              <span>🎬 Episodes: {show.number_of_episodes}</span>
            </div>

            <div className="genres">
              {show.genres?.map((genre) => (
                <span key={genre.id} className="genre-badge">{genre.name}</span>
              ))}
            </div>
          </div>
        </div>

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
              <p className="no-feedback">No reviews available for this TV show yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
