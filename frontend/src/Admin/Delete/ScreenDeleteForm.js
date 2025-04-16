import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScreenDeleteForm = () => {
  const [screenId, setScreenId] = useState('');
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    // Fetch the list of all screens
    axios.get('http://localhost:8080/screen/all')
      .then(response => setScreens(response.data))
      .catch(error => console.error('Error fetching screens', error));
  }, []);

  const handleDelete = () => {
    if (!screenId) {
      return alert('Please select a screen');
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the screen with ID ${screenId}?`);
    if (!confirmDelete) return;

    axios.delete(`http://localhost:8080/screen/delete/${screenId}`)
      .then(() => {
        alert('Screen deleted successfully!');
        setScreenId('');
        axios.get('http://localhost:8080/screen/all').then(response => setScreens(response.data));
      })
      .catch(error => {
        alert('Failed to delete screen: ' + error.message);
        console.error('Delete error:', error);
      });
  };

  return (
    <div className="delete-screen">
      <h1>Delete Screen</h1>
      <div>
        <label>Select Screen ID:</label>
        <select value={screenId} onChange={(e) => setScreenId(e.target.value)}>
          <option value="">Select a screen</option>
          {screens.map((screen) => (
            <option key={screen.screenId} value={screen.screenId}>
              Screen {screen.screenNo} - Theater {screen.theater.theaterName}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white', marginTop: '10px' }}>
        Delete Screen
      </button>
    </div>
  );
};

export default ScreenDeleteForm;
