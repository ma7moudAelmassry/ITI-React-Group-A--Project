import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import TvShows from "./components/TvShows/TvShows";
import TvDetails from "./components/TvDetails/TvDetails";
import PlaceholderPage from "./components/PlaceholderPage";
import Chatbot from "./components/Chatbot/Chatbot";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import Wishlist from "./components/Wishlist/Wishlist";

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

          <Route path="/tv" element={<TvShows />} />
          <Route path="/tv/:id" element={<TvDetails />} />
          
      
        
           <Route path="/wishlist" element={<Wishlist />} />
           <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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