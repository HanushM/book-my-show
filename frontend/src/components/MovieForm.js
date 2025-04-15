import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminForm.css'; // use the common form styling here

const MovieForm = () => {
  const [movieData, setMovieData] = useState({
    name: '',
    movieid: '',
    releaseDate: '',
    linkToTrailer: '',
    cast: '',
    languages: '',
    rating: '',
    genre: '',
    comments: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData({
      ...movieData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMovieData({
      ...movieData,
      image: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', movieData.name);
    formData.append('movieid', movieData.movieid);
    formData.append('releaseDate', movieData.releaseDate);
    formData.append('linkToTrailer', movieData.linkToTrailer);
    formData.append('cast', movieData.cast.split(',').map((item) => item.trim()).join(','));
    formData.append('languages', movieData.languages.split(',').map((item) => item.trim()).join(','));
    formData.append('rating', movieData.rating);
    formData.append('genre', movieData.genre);
    formData.append('comments', movieData.comments);

    if (movieData.image) {
      formData.append('image', movieData.image);
    }

    axios.post('http://localhost:8080/movies/upload', formData)
      .then((response) => {
        alert('Movie uploaded successfully!');
        setMovieData({
          name: '',
          movieid: '',
          releaseDate: '',
          linkToTrailer: '',
          cast: '',
          languages: '',
          rating: '',
          genre: '',
          comments: '',
          image: null,
        });
      })
      .catch((error) => {
        alert('Error uploading movie: ' + error.message);
      });
  };

  return (
    <div className="upload">
      <h1>Upload Movie Details</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Movie Name:</label>
          <input type="text" name="name" value={movieData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Movie ID:</label>
          <input type="number" name="movieid" value={movieData.movieid} onChange={handleChange} />
        </div>
        <div>
          <label>Release Date:</label>
          <input type="date" name="releaseDate" value={movieData.releaseDate} onChange={handleChange} />
        </div>
        <div>
          <label>Link to Trailer:</label>
          <input type="url" name="linkToTrailer" value={movieData.linkToTrailer} onChange={handleChange} />
        </div>
        <div>
          <label>Cast (comma separated):</label>
          <input type="text" name="cast" value={movieData.cast} onChange={handleChange} />
        </div>
        <div>
          <label>Languages (comma separated):</label>
          <input type="text" name="languages" value={movieData.languages} onChange={handleChange} />
        </div>
        <div>
          <label>Rating:</label>
          <input type="number" name="rating" value={movieData.rating} onChange={handleChange} />
        </div>
        <div>
          <label>Genre:</label>
          <input type="text" name="genre" value={movieData.genre} onChange={handleChange} />
        </div>
        <div>
          <label>Comments:</label>
          <textarea name="comments" value={movieData.comments} onChange={handleChange}></textarea>
        </div>
        <div>
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MovieForm;
