import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TheaterDeleteForm = () => {
  const [theaterList, setTheaterList] = useState([]);

  useEffect(() => {
    // Fetch all theaters to populate the selection dropdown
    axios.get('http://localhost:8080/theater/all')
      .then(response => {
        setTheaterList(response.data);
      })
      .catch(error => {
        console.error('Error fetching theaters', error);
      });
  }, []);

  const handleDelete = (theaterId) => {
    if (window.confirm("Are you sure you want to delete this theater?")) {
      axios.delete(`http://localhost:8080/theater/delete/${theaterId}`)
        .then(() => {
          alert('Theater deleted successfully!');
          // After deletion, remove the deleted theater from the list
          setTheaterList(theaterList.filter(theater => theater.theaterId !== theaterId));
        })
        .catch((error) => {
          alert('Error deleting theater: ' + error.message);
        });
    }
  };

  return (
    <div className="delete">
      <h1>Delete Theater</h1>
      <div>
        <label>Select Theater to Delete:</label>
        <select>
          <option value="">Select a theater</option>
          {theaterList.map((theater) => (
            <option key={theater.theaterId} value={theater.theaterId}>
              {theater.theaterName}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            const selectedTheaterId = document.querySelector('select').value;
            if (selectedTheaterId) {
              handleDelete(selectedTheaterId);
            } else {
              alert('Please select a theater');
            }
          }}
        >
          Delete Theater
        </button>
      </div>
    </div>
  );
};

export default TheaterDeleteForm;
