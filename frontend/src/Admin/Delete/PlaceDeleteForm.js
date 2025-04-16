import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlaceDeleteForm = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPinCode, setSelectedPinCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = () => {
    axios.get('http://localhost:8080/place/all')
      .then(res => setPlaces(res.data))
      .catch(err => console.error('Error fetching places:', err));
  };

  const handleDelete = () => {
    if (!selectedPinCode) return alert("Please select a place");

    const confirmDelete = window.confirm(`Are you sure you want to delete the place with pincode ${selectedPinCode}?`);
    if (!confirmDelete) return;

    axios.delete(`http://localhost:8080/place/delete/${selectedPinCode}`)
      .then(() => {
        setMessage('✅ Place deleted successfully!');
        setSelectedPinCode('');
        fetchPlaces();
      })
      .catch(err => {
        console.error('Error deleting:', err);
        setMessage('❌ Failed to delete place. Please try again.');
      });
  };

  return (
    <div className="delete-place">
      <h2>Delete Place</h2>

      <div>
        <label>Select Pin Code:</label>
        <select value={selectedPinCode} onChange={(e) => setSelectedPinCode(e.target.value)}>
          <option value="">-- Select Pin Code --</option>
          {places.map(place => (
            <option key={place.pinCode} value={place.pinCode}>
              {place.pinCode} - {place.city}, {place.state}
            </option>
          ))}
        </select>
      </div>

      {selectedPinCode && (
        <button
          onClick={handleDelete}
          style={{ backgroundColor: 'red', color: 'white', marginTop: '10px' }}
        >
          Delete Place
        </button>
      )}

      {message && (
        <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>
      )}
    </div>
  );
};

export default PlaceDeleteForm;
