import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScreenForm = () => {
  const [screenData, setScreenData] = useState({
    screenNo: '',
    capacity: '',
    theater: {
      theaterId: '', 
    },
  });

  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/theater/all')
      .then(response => {
        setTheaters(response.data);
      })
      .catch(error => {
        console.error('Error fetching theaters', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'theaterId') {
      setScreenData({ ...screenData, theater: { theaterId: value } }); // Update the theater object with the selected theaterId
    } else {
      setScreenData({ ...screenData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = { ...screenData };

    axios
      .post('http://localhost:8080/screen/addScreen', formData, {
        headers: {
          'Content-Type': 'application/json', 
        },
      })
      .then((response) => {
        alert('Screen added successfully!');
        setScreenData({
          screenNo: '',
          capacity: '',
          theater: {
            theaterId: '',
          },
        });
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error response:', error.response);
          alert('Error adding screen: ' + error.response.data); 
        } else if (error.request) {
          console.error('Error request:', error.request);
          alert('Error adding screen: No response from the server');
        } else {
          console.error('Error:', error.message);
          alert('Error adding screen: ' + error.message);
        }
      });
  };

  return (
    <div className='upload'>
      <h1>Add New Screen</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Screen No:</label>
          <input
            type="number"
            name="screenNo"
            value={screenData.screenNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Capacity:</label>
          <input
            type="number"
            name="capacity"
            value={screenData.capacity}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Theater:</label>
          <select
            name="theaterId"
            value={screenData.theater.theaterId}
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
        <button type="submit">Add Screen</button>
      </form>
    </div>
  );
};

export default ScreenForm;