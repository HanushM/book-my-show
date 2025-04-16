import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScreenUpdateForm = () => {
  const [screenData, setScreenData] = useState({
    screenNo: '',
    capacity: '',
    theaterId: '',
  });

  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [screenId, setScreenId] = useState(null);

  // Fetch all theaters
  useEffect(() => {
    axios.get('http://localhost:8080/theater/all')
      .then(res => setTheaters(res.data))
      .catch(err => console.error('Error fetching theaters:', err));
  }, []);

  // Fetch screen list when theater changes
  useEffect(() => {
    if (screenData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenList/${screenData.theaterId}`)
        .then(res => setScreens(res.data))
        .catch(err => console.error('Error fetching screens:', err));
    }
  }, [screenData.theaterId]);

  // Fetch screen ID when screenNo and theaterId are selected
  useEffect(() => {
    if (screenData.screenNo && screenData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenId?num=${screenData.screenNo}&theaterId=${screenData.theaterId}`)
        .then(res => setScreenId(res.data))
        .catch(err => console.error('Error fetching screen ID:', err));
    }
  }, [screenData.screenNo, screenData.theaterId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScreenData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!screenId) {
      alert('Screen ID not found. Please check theater and screen selection.');
      return;
    }

    const updatedScreen = {
      screenNo: screenData.screenNo,
      capacity: screenData.capacity,
      theater: { theaterId: screenData.theaterId }
    };

    axios.put(`http://localhost:8080/screen/update/${screenId}`, updatedScreen)
      .then(() => alert('Screen capacity updated successfully!'))
      .catch(err => {
        console.error('Error updating screen:', err);
        alert('Error updating screen: ' + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="update-screen">
      <h2>Update Screen Capacity</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Theater:</label>
          <select name="theaterId" value={screenData.theaterId} onChange={handleChange} required>
            <option value="">Select a theater</option>
            {theaters.map(theater => (
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
            value={screenData.screenNo}
            onChange={handleChange}
            disabled={!screenData.theaterId}
            required
          >
            <option value="">Select a screen</option>
            {screens.map(screenNo => (
              <option key={screenNo} value={screenNo}>
                Screen {screenNo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>New Capacity:</label>
          <input
            type="number"
            name="capacity"
            value={screenData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Update Capacity</button>
      </form>
    </div>
  );
};

export default ScreenUpdateForm;
