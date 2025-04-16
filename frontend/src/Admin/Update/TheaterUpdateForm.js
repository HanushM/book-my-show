import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TheaterUpdateForm = () => {
  const [theaterData, setTheaterData] = useState({
    theaterName: '',
    pinCode: '',
  });

  const [places, setPlaces] = useState([]);
  const [theaterList, setTheaterList] = useState([]);
  const [selectedTheaterId, setSelectedTheaterId] = useState('');

  useEffect(() => {
    // Fetch all places
    axios.get('http://localhost:8080/place/all')
      .then(response => setPlaces(response.data))
      .catch(error => console.error('Error fetching places', error));

    // Fetch all theaters
    axios.get('http://localhost:8080/theater/all')
      .then(response => setTheaterList(response.data))
      .catch(error => console.error('Error fetching theaters', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTheaterData(prev => ({ ...prev, [name]: value }));
  };

  const handleTheaterSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedTheaterId(selectedId);

    if (selectedId) {
      axios.get(`http://localhost:8080/theater/${selectedId}`)
        .then(response => {
          setTheaterData({
            theaterName: response.data.theaterName,
            pinCode: response.data.place.pinCode,
          });
        })
        .catch(error => {
          console.error('Error fetching selected theater details', error);
        });
    } else {
      setTheaterData({ theaterName: '', pinCode: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      theaterName: theaterData.theaterName,
      place: {
        pinCode: theaterData.pinCode,
      },
    };

    if (!selectedTheaterId) {
      alert('Please select a theater to update.');
      return;
    }

    axios.put(`http://localhost:8080/theater/update/${selectedTheaterId}`, formData)
      .then(() => {
        alert('Theater updated successfully!');
      })
      .catch((error) => {
        alert('Error updating theater: ' + error.message);
      });
  };

  return (
    <div className='update'>
      <h1>Update Theater</h1>
      <form onSubmit={handleSubmit}>
        {/* Theater selection */}
        <div>
          <label>Select Theater to Update:</label>
          <select
            name="theaterId"
            value={selectedTheaterId}
            onChange={handleTheaterSelect}
            required
          >
            <option value="">Select a theater</option>
            {theaterList.map((theater) => (
              <option key={theater.theaterId} value={theater.theaterId}>
                {theater.theaterName}
              </option>
            ))}
          </select>
        </div>

        {/* Theater Name */}
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

        {/* Place/Pin Code */}
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
                {place.city}, {place.district} - {place.state} ({place.pinCode})
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Update Theater</button>
      </form>
    </div>
  );
};

export default TheaterUpdateForm;
