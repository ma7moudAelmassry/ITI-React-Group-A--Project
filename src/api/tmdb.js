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

export function imageUrl(path, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
