import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";



export default function App() {
  return (
    <>

      <Navbar />

   
      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </>
  );
}