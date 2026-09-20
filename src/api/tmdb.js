const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "4dbec6994aabb071b7589d1ad524b48a";
export const imageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function request(endpoint, params = {}) {
  if (!API_KEY || API_KEY.startsWith("put_your")) {
    throw new Error(
      "TMDB API key is missing. Create a .env file with VITE_TMDB_API_KEY=your_key and restart the dev server."
    );
  }

  const url = new URL(BASE_URL + endpoint);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Network error. Check your internet connection and try again.");
  }

  if (!res.ok) {
    let message = `Request failed (${res.status}).`;
    try {
      const body = await res.json();
      if (body.status_message) message = body.status_message;
    } catch {
      
    }
    throw new Error(message);
  }
  return res.json();
}


export const getNowPlayingMovies = (page = 1) => request("/movie/now_playing", { page });
export const getMovie = (id) => request(`/movie/${id}`);
export const getMovieRecommendations = (id) => request(`/movie/${id}/recommendations`);
export const getMovieReviews = (id) => request(`/movie/${id}/reviews`);
export const searchMovies = (query, page = 1) => request("/search/movie", { query, page });


export const getPopularTv = (page = 1) => request("/tv/popular", { page });
export const getTv = (id) => request(`/tv/${id}`);
export const getTvRecommendations = (id) => request(`/tv/${id}/recommendations`);
