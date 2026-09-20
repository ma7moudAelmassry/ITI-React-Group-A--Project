import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import "./App.css"; 

export default function App() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>

      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </>
  );
}