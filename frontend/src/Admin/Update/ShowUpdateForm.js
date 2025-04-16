import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowUpdateForm = () => {
  const [showData, setShowData] = useState({
    movieName: '',
    screenNo: '',
    startTime: '',
    endTime: '',
    date: '',
    theaterId: '',
    screenId: '',
  });

  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showId, setShowId] = useState(null);

  // Fetch all movies and theaters initially
  useEffect(() => {
    axios.get('http://localhost:8080/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error('Error fetching movies:', err));

    axios.get('http://localhost:8080/theater/all')
      .then(res => setTheaters(res.data))
      .catch(err => console.error('Error fetching theaters:', err));
  }, []);

  // Fetch available screens when theater is selected
  useEffect(() => {
    if (showData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenList/${showData.theaterId}`)
        .then(res => setScreens(res.data))
        .catch(err => console.error('Error fetching screens:', err));
    }
  }, [showData.theaterId]);

  // Get screenId based on theaterId and screenNo
  useEffect(() => {
    if (showData.screenNo && showData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenId?num=${showData.screenNo}&theaterId=${showData.theaterId}`)
        .then(res => setShowData(prev => ({ ...prev, screenId: res.data })))
        .catch(err => console.error('Error fetching screen ID:', err));
    }
  }, [showData.screenNo, showData.theaterId]);

  // Fetch show ID once all required values are selected
  useEffect(() => {
    const { movieName, date, screenId } = showData;
    if (movieName && date && screenId) {
      axios.get(`http://localhost:8080/shows/screen-times?movieName=${movieName}&date=${date}`)
        .then(res => {
          const matchingShow = res.data.find(s => s.screenId === parseInt(screenId));
          if (matchingShow) {
            setShowId(matchingShow.timeId);
          } else {
            setShowId(null);
            alert("No show found for the selected movie, screen, and date.");
          }
        })
        .catch(err => console.error("Error fetching show ID:", err));
    }
  }, [showData.movieName, showData.date, showData.screenId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!showId) {
      alert("No show ID found for updating!");
      return;
    }

    if (!showData.startTime || !showData.endTime) {
      alert("Start time and End time are required!");
      return;
    }

    // Ensure times are correctly formatted as HH:mm:ss
    const payload = {
      movieName: showData.movieName,
      screenId: showData.screenId,
      startTime: showData.startTime + ":00", // Convert to HH:mm:ss
      endTime: showData.endTime + ":00",     // Convert to HH:mm:ss
      date: showData.date,
    };

    axios.put(`http://localhost:8080/shows/update/${showId}`, payload)
      .then(() => alert('Show updated successfully!'))
      .catch(err => {
        console.error('Update failed:', err);
        alert('Error updating show: ' + err.message);
      });
  };

  return (
    <div className="upload">
      <h1>Update Show</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Movie:</label>
          <select name="movieName" value={showData.movieName} onChange={handleChange}>
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
          <select name="theaterId" value={showData.theaterId} onChange={handleChange}>
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
          <select name="screenNo" value={showData.screenNo} onChange={handleChange}>
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

        <button type="submit">Update Show</button>
      </form>
    </div>
  );
};

export default ShowUpdateForm;
