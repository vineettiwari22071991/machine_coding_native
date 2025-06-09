const BASE_URL = "https://api.themoviedb.org/3/";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGFlZmRkZTIwN2ZlZDA1YzkzOWU0NzNiZDUyM2Y5MSIsIm5iZiI6MTczNzg3MDI1NS42NTQsInN1YiI6IjY3OTVjYmFmMDhjMTcyOWVjOTE4YjA1MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RYh96yAwrJod8j-AxBoIHmUjfNOxTMt6n965oP4KqYk",
  },
};

export const getInitialMovie = async () => {
  const response = await fetch(`${BASE_URL}movie/now_playing?language=en-US&page=1`, options);
  if (!response.ok) throw new Error("Failed to fetch initial movies");
  return response.json();
};

export const searchMoview = async (query: string) => {
  const response = await fetch(
    `${BASE_URL}search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
    options
  );
  if (!response.ok) throw new Error("Search request failed");
  return response.json();
};
