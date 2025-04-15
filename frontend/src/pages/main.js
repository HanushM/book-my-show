import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminFormBar from "../components/AdminFormBar";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";
import "../styles/Main.css";

function Main() {

  const [showAdminBar, setShowAdminBar] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'user';

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/movies');
        setMovies(response.data);
      } catch (err) {
        console.error('Error fetching movies: ', err);
      }
    };
    fetchMovies();
  }, []);

  const handleUploadClick = () => {
    setShowAdminBar(prev => !prev);
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'All' || movie.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  return (
    <div>
      <Header
        onUploadClick={handleUploadClick}
      />
      {showAdminBar && <AdminFormBar />}
      <h1 className="movies-title">Movies List</h1>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="All">All Genres</option>
          <option value="Action">Action</option>
          <option value="Sci-Fi">Sci-Fi</option>
        </select>
      </div>

      <div className="movie-container">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie.name}
              movie={movie}
              onClick={() => {
                if (role === 'admin') {
                  return;
                }
                navigate('/shows', { state: { movieName:  movie.name} });
              }}
            />
          ))
        ) : (
          <p>No movies found!</p>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Main;
