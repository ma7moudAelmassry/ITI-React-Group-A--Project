import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";
import MovieDetails from "./components/MovieDetails/MovieDetails"; 
import PlaceholderPage from "./components/PlaceholderPage";
import Chatbot from "./components/Chatbot/Chatbot";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetails />} /> 
          <Route path="/tv" element={<PlaceholderPage title="TV shows" />} />
          <Route path="/wishlist" element={<PlaceholderPage title="Wishlist" />} />
          <Route path="/login" element={<PlaceholderPage title="Log in" />} />
          <Route path="/register" element={<PlaceholderPage title="Sign up" />} />
          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page not found"
                message="The page you are looking for does not exist."
              />
            }
          />
        </Routes>
      </main>

      <Chatbot />

      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </>
  );
}