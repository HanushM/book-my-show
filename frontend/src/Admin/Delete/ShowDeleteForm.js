import React, { useState } from 'react';
import axios from 'axios';

const ShowDelete = () => {
  const [showId, setShowId] = useState('');

  const handleDelete = () => {
    if (!showId) {
      alert('Please enter a Show ID to delete.');
      return;
    }

    axios.delete(`http://localhost:8080/shows/delete/${showId}`)
      .then(() => {
        alert('Show deleted successfully!');
        setShowId('');
      })
      .catch((error) => {
        alert('Error deleting show: ' + error.message);
      });
  };

  return (
    <div className="delete-form">
      <h2>Delete Showtime</h2>
      <input
        type="text"
        placeholder="Enter Show ID"
        value={showId}
        onChange={(e) => setShowId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete Show</button>
    </div>
  );
};

export default ShowDelete;
