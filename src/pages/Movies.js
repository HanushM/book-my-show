import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');

  // Fetch movies when component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/movies');
        setMovies(response.data); 
      } catch (err) {
        console.error('Error fetching movies: ', err);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on search term and genre
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'All' || movie.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="movies">
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
            <MovieCard key={movie._id} movie={movie} />
          ))
        ) : (
          <p>No movies found!</p>
        )}
      </div>
    </div>
  );
};

export default Movies;
