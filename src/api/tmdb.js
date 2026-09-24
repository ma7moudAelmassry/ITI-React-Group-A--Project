const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
}

// Search for a specific movie
export function fetchSearchMovies(query, page = 1) {
  return tmdbFetch(
    `/search/movie?query=${encodeURIComponent(
      query
    )}&language=en-US&page=${page}`
  );
}

// Get currently playing movies
export function fetchNowPlaying(page = 1) {
  return tmdbFetch(
    `/movie/now_playing?language=en-US&page=${page}`
  );
}

// Get movie details
export function fetchMovieDetails(movieId) {
  return tmdbFetch(
    `/movie/${movieId}?language=en-US`
  );
}

// Get movie reviews
export function fetchMovieReviews(movieId) {
  return tmdbFetch(
    `/movie/${movieId}/reviews?language=en-US&page=1`
  );
}

// TV-Show Section
export function fetchTvOnTheAir(page = 1) {
  return tmdbFetch(`/tv/on_the_air?language=en-US&page=${page}`);
}

export function fetchTvPopular(page = 1) {
  return tmdbFetch(`/tv/popular?language=en-US&page=${page}`);
}

export function fetchSearchTv(query, page = 1) {
  return tmdbFetch(
    `/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
  );
}

export function fetchTvDetails(tvId) {
  return tmdbFetch(`/tv/${tvId}?language=en-US`);
}

export function fetchTvReviews(tvId) {
  return tmdbFetch(`/tv/${tvId}/reviews?language=en-US&page=1`);
}

// Discover movies using filters
export function discoverMovies(
  { year, genreId, page = 1 } = {}
) {
  const params = new URLSearchParams({
    language: "en-US",
    sort_by: "popularity.desc",
    page: page.toString(),
  });

  if (year) {
    params.append("primary_release_year", year);
  }

  if (genreId) {
    params.append("with_genres", genreId);
  }

  return tmdbFetch(
    `/discover/movie?${params.toString()}`
  );
}

// Get similar movies
export function fetchSimilarMovies(movieId) {
  return tmdbFetch(
    `/movie/${movieId}/similar?language=en-US&page=1`
  );
}

// Convert poster path to full image URL
export function imageUrl(path, size = "w500") {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : null;
}