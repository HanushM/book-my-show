import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MovieUpdateForm = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [movieData, setMovieData] = useState({
    name: '',
    releaseDate: '',
    linkToTrailer: '',
    cast: '',
    languages: '',
    rating: '',
    genre: '',
    comments: '',
  });

  useEffect(() => {
    axios.get('http://localhost:8080/movies')
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  useEffect(() => {
    if (selectedMovieId) {
      axios.get(`http://localhost:8080/movies/${selectedMovieId}`)
        .then(response => {
          const movie = response.data;
          setMovieData({
            name: movie.name,
            releaseDate: movie.releaseDate?.substring(0, 10),
            linkToTrailer: movie.linkToTrailer,
            cast: movie.cast?.join(', ') || '',
            languages: movie.languages?.join(', ') || '',
            rating: movie.rating,
            genre: movie.genre,
            comments: movie.comments,
          });
        })
        .catch(error => console.error('Error loading movie:', error));
    }
  }, [selectedMovieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData({ ...movieData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedMovie = {
      ...movieData,
      cast: movieData.cast.split(',').map(item => item.trim()),
      languages: movieData.languages.split(',').map(item => item.trim()),
    };

    axios.put(`http://localhost:8080/movies/${selectedMovieId}`, updatedMovie)
      .then(() => alert('Movie updated successfully!'))
      .catch(error => alert('Update failed: ' + error.message));
  };

  return (
    <div className="update-movie">
      <h2>Update Movie</h2>

      <div className="form-group">
        <label><strong>Select Movie:</strong></label>
        <select onChange={(e) => setSelectedMovieId(e.target.value)} value={selectedMovieId}>
          <option value="">-- Select Movie --</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.name}
            </option>
          ))}
        </select>
      </div>

      {selectedMovieId && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Movie Name:</label>
            <input name="name" value={movieData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Release Date:</label>
            <input name="releaseDate" type="date" value={movieData.releaseDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Trailer Link:</label>
            <input name="linkToTrailer" value={movieData.linkToTrailer} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Cast (comma separated):</label>
            <input name="cast" value={movieData.cast} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Languages (comma separated):</label>
            <input name="languages" value={movieData.languages} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Rating:</label>
            <input name="rating" type="number" value={movieData.rating} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Genre:</label>
            <input name="genre" value={movieData.genre} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Comments:</label>
            <textarea name="comments" value={movieData.comments} onChange={handleChange}></textarea>
          </div>

          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default MovieUpdateForm;
