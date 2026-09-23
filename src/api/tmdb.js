const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZGJlYzY5OTRhYWJiMDcxYjc1ODlkMWFkNTI0YjQ4YSIsIm5iZiI6MTc4OTkyMTY0MC4yNDg5OTk4LCJzdWIiOiI2YWIwMDk2ODUxYTg1ZWIzZTA0YzhiOWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.izblZEP668jKD3lGxrp2xPPIMpWx6dLcY6aZmxRMVkc";

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
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return response.json();
}

export function fetchNowPlaying(page = 1) {
  return tmdbFetch(`/movie/now_playing?language=en-US&page=${page}`);
}


export function fetchSearchMovies(query, page = 1) {
  return tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`);
}

export function imageUrl(path, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export function fetchMovieDetails(movieId) {
  return tmdbFetch(`/movie/${movieId}?language=en-US`);
}
export function fetchMovieReviews(movieId) {
  return tmdbFetch(`/movie/${movieId}/reviews?language=en-US&page=1`);
}

// TV-Show Section
export function fetchTvOnTheAir(page = 1) {
  return tmdbFetch(`/tv/on_the_air?language=en-US&page=${page}`);
}

export function fetchTvPopular(page = 1) {
  return tmdbFetch(`/tv/popular?language=en-US&page=${page}`);
}

export function fetchSearchTv(query, page = 1) {
  return tmdbFetch(`/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}`);
}

export function fetchTvDetails(tvId) {
  return tmdbFetch(`/tv/${tvId}?language=en-US`);
}

export function fetchTvReviews(tvId) {
  return tmdbFetch(`/tv/${tvId}/reviews?language=en-US&page=1`);
}