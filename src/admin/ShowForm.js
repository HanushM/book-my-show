import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowForm = () => {
  // State to hold form data for the show
  const [showData, setShowData] = useState({
    movieName: '',  // Store movieName instead of movieId
    screenNo: '',   // Screen selection (screenNo)
    startTime: '',  // Start time of the show
    endTime: '',    // End time of the show
    date: '',       // Date of the show
    theaterId: '',  // Store selected theaterId
    screenId: '',   // Store the selected screenId
  });

  // State to hold available screens, movies, and theaters
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);

  // Fetch theaters and movies when the component mounts
  useEffect(() => {
    // Fetch available theaters to allow user to select a theater
    axios.get('http://localhost:8080/theater/all')
      .then((response) => {
        setTheaters(response.data); // Populate theater list from the backend
      })
      .catch((error) => {
        console.error('Error fetching theaters:', error);
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

  // Fetch screens based on the selected theaterId
  useEffect(() => {
    if (showData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenList/${showData.theaterId}`)
        .then((response) => {
          setScreens(response.data); // Populate screen list based on selected theater
        })
        .catch((error) => {
          console.error('Error fetching screens:', error);
        });
    }
  }, [showData.theaterId]); // Dependency to fetch screens when theaterId changes

  // Fetch screenId based on the selected screenNo and theaterId
  useEffect(() => {
    if (showData.screenNo && showData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenId?num=${showData.screenNo}&theaterId=${showData.theaterId}`)
        .then((response) => {
          setShowData((prevState) => ({
            ...prevState,
            screenId: response.data, // Set the screenId from the backend
          }));
        })
        .catch((error) => {
          console.error('Error fetching screenId:', error);
        });
    }
  }, [showData.screenNo, showData.theaterId]); // Dependency to fetch screenId when screenNo or theaterId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowData({ ...showData, [name]: value }); // Update state on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Structure the data according to the request body format for the showtime
    const requestBody = {
      movieName: showData.movieName, // Send movieName instead of movieId
      screenId: showData.screenId,   // Send the selected screenId
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
        screenNo: '',
        startTime: '',
        endTime: '',
        date: '',
        theaterId: '', // Clear the theaterId field as well
        screenId: '',  // Clear the screenId field
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
              <option key={movie.movieName} value={movie.name}>
                {movie.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Theater:</label>
          <select
            name="theaterId"
            value={showData.theaterId}
            onChange={handleChange}
          >
            <option value="">Select a theater</option>
            {theaters.map((theater) => (
              <option key={theater.theaterId} value={theater.theaterId}>
                {theater.theaterName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Screen No:</label>
          <select
            name="screenNo"
            value={showData.screenNo}
            onChange={handleChange}
            disabled={!showData.theaterId}  // Disable until a theater is selected
          >
            <option value="">Select a screen</option>
            {screens.map((screen) => (
              <option key={screen} value={screen}>
                Screen {screen}
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
