import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowForm = () => {
  // State to hold form data for the show
  const [showData, setShowData] = useState({
    movieName: '',  // Store movieName instead of movieId
    screenId: '',   // Screen selection (screenId)
    startTime: '',  // Start time of the show
    endTime: '',    // End time of the show
    date: '',       // Date of the show
  });

  // State to hold available screens and movies
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch available screens to allow user to select a screen
    axios.get('http://localhost:8080/screen/all')
      .then((response) => {
        setScreens(response.data); // Populate screen list from the backend
      })
      .catch((error) => {
        console.error('Error fetching screens:', error);
      });

    // Fetch available movies to allow user to select a movie
    axios.get('http://localhost:8080/movies')
      .then((response) => {
        setMovies(response.data); // Populate movie list from the backend
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowData({ ...showData, [name]: value }); // Update state on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Structure the data according to the request body format for the showtime
    const requestBody = {
      movieName: showData.movieName, // Send movieName instead of movieId
      screenId: showData.screenId,
      startTime: showData.startTime,
      endTime: showData.endTime,
      date: showData.date,
    };

    // Send the structured data to the backend to add a new showtime
    axios.post('http://localhost:8080/shows/add', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      alert('Showtime added successfully!');
      // Reset form fields after success
      setShowData({
        movieName: '',
        screenId: '',
        startTime: '',
        endTime: '',
        date: '',
      });
    })
    .catch((error) => {
      alert('Error adding showtime: ' + error.message); // Handle errors
    });
  };

  return (
    <div className='upload'>
      <h1>Add New Showtime</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Movie:</label>
          <select
            name="movieName" // Store movieName here instead of movieId
            value={showData.movieName}
            onChange={handleChange}
          >
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie.movieName} value={movie.name}> {/* Store movie name in the state */}
                {movie.name} {/* Display movie name */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Screen:</label>
          <select
            name="screenId"
            value={showData.screenId}
            onChange={handleChange}
          >
            <option value="">Select a screen</option>
            {screens.map((screen) => (
              <option key={screen.screenId} value={screen.screenId}>
                {screen.screenName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Start Time:</label>
          <input
            type="time"
            name="startTime"
            value={showData.startTime}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>End Time:</label>
          <input
            type="time"
            name="endTime"
            value={showData.endTime}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={showData.date}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Add Showtime</button>
      </form>
    </div>
  );
};

export default ShowForm;
