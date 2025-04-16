import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlaceUpdateForm = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPinCode, setSelectedPinCode] = useState('');
  const [placeData, setPlaceData] = useState({
    pinCode: '',
    city: '',
    state: '',
    country: '',
  });

  // Fetch all places on mount
  useEffect(() => {
    axios.get('http://localhost:8080/place/all')
      .then(response => setPlaces(response.data))
      .catch(error => console.error('Error fetching places:', error));
  }, []);

  // Load selected place
  useEffect(() => {
    if (selectedPinCode) {
      const place = places.find(p => p.pinCode.toString() === selectedPinCode);
      if (place) {
        setPlaceData({
          pinCode: place.pinCode,
          city: place.city,
          state: place.state,
          country: place.country,
        });
      }
    }
  }, [selectedPinCode, places]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaceData({ ...placeData, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:8080/place/update/${selectedPinCode}`, placeData)
      .then(() => {
        alert('Place updated successfully!');
        setSelectedPinCode('');
        setPlaceData({ pinCode: '', city: '', state: '', country: '' });
      })
      .catch(err => alert('Update failed: ' + err.message));
  };

  return (
    <div className='update-place'>
      <h2>Update Place</h2>

      {/* Select dropdown */}
      <div className="form-group">
        <label htmlFor="pinSelect">Select Pin Code:</label>
        <select
          id="pinSelect"
          value={selectedPinCode}
          onChange={(e) => setSelectedPinCode(e.target.value)}
        >
          <option value="">-- Select Pin Code --</option>
          {places.map(place => (
            <option key={place.pinCode} value={place.pinCode}>
              {place.pinCode} - {place.city}
            </option>
          ))}
        </select>
      </div>

      {/* Form fields */}
      {selectedPinCode && (
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Enter City"
              value={placeData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="Enter State"
              value={placeData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Enter Country"
              value={placeData.country}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default PlaceUpdateForm;
