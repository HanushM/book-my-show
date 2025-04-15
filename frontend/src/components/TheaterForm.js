import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminForm.css';
const TheaterForm = () => {
  const [theaterData, setTheaterData] = useState({
    theaterName: '',
    pinCode: '', // The pinCode to be selected from Places
  });

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Fetch places data to allow the user to select a place
    axios.get('http://localhost:8080/place/all') // Fetching all places
      .then(response => {
        setPlaces(response.data); // Store fetched places in state
      })
      .catch(error => {
        console.error('Error fetching places', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTheaterData({ ...theaterData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the formData to match the backend structure
    const formData = {
      theaterName: theaterData.theaterName,
      place: {
        pinCode: theaterData.pinCode, // Wrap pinCode inside the place object
      },
    };

    // Send the POST request to add the new theater
    axios
      .post('http://localhost:8080/theater/add', formData)
      .then((response) => {
        alert('Theater added successfully!');
        setTheaterData({
          theaterName: '',
          pinCode: '',
        }); // Reset the form
      })
      .catch((error) => {
        alert('Error adding theater: ' + error.message);
      });
  };

  return (
    <div className='upload'>
      <h1>Add New Theater</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Theater Name:</label>
          <input
            type="text"
            name="theaterName"
            value={theaterData.theaterName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Place (Pin Code):</label>
          <select
            name="pinCode"
            value={theaterData.pinCode}
            onChange={handleChange}
            required
          >
            <option value="">Select a place</option>
            {places.map((place) => (
              <option key={place.pinCode} value={place.pinCode}>
                {place.city} - {place.state} ({place.pinCode})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Theater</button>
      </form>
    </div>
  );
};

export default TheaterForm;