import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MovieDeleteForm = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedMovieName, setSelectedMovieName] = useState('');

  // Fetch all movies for dropdown
  useEffect(() => {
    axios.get('http://localhost:8080/movies')
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  const handleDelete = () => {
    if (!selectedMovieId) {
      alert("Please select a movie to delete.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete the movie "${selectedMovieName}"?`);
    if (!confirmed) return;

    axios.delete(`http://localhost:8080/movies/${selectedMovieId}`)
      .then(() => {
        alert(`Movie "${selectedMovieName}" deleted successfully!`);
        setSelectedMovieId('');
        setSelectedMovieName('');
        // Re-fetch updated movie list
        axios.get('http://localhost:8080/movies')
          .then(response => setMovies(response.data));
      })
      .catch(error => {
        alert('Failed to delete movie: ' + error.message);
      });
  };

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedMovieId(selectedId);
    const movie = movies.find(m => m.id === selectedId);
    setSelectedMovieName(movie ? movie.name : '');
  };

  return (
    <div className="delete-movie">
      <h2>Delete Movie</h2>

      <div className="form-group">
        <label>Select Movie to Delete:</label>
        <select value={selectedMovieId} onChange={handleSelect}>
          <option value="">-- Select Movie --</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.name}
            </option>
          ))}
        </select>
      </div>

      {selectedMovieId && (
        <div style={{ marginTop: '10px' }}>
          <p><strong>Selected Movie:</strong> {selectedMovieName}</p>
          <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
            Delete Movie
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieDeleteForm;
