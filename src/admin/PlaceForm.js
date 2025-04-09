import React, { useState } from 'react';
import axios from 'axios';

const PlaceForm = () => {
  const [placeData, setPlaceData] = useState({
    pinCode: '',
    city: '',
    state: '',
    country: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaceData({ ...placeData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = { ...placeData };
    console.log(formData);
  
    axios.post('http://localhost:8080/place/add', formData, {
      headers: {
        'Content-Type': 'application/json', 
      },
    })
    .then(response => {
      alert('Place added successfully!');
      setPlaceData({
        pinCode: '',
        city: '',
        state: '',
        country: '',
      });
    })
    .catch(error => {
      console.error('Error adding place:', error.response ? error.response.data : error.message);
      alert('Error adding place: ' + (error.response ? error.response.data : error.message));
    });
  };
  

  return (
    <div className='upload'>
      <h1>Add New Place</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pin Code:</label>
          <input
            type="number"
            name="pinCode"
            value={placeData.pinCode}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={placeData.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={placeData.state}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={placeData.country}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Place</button>
      </form>
    </div>
  );
};

export default PlaceForm;
