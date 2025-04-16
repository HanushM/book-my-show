import React, { useState } from 'react';
import axios from 'axios';

const TierDelete = () => {
  const [tierId, setTierId] = useState('');

  const handleDelete = () => {
    if (!tierId) {
      alert('Please enter a Tier ID to delete.');
      return;
    }

    axios.delete(`http://localhost:8080/tier/deleteTier/${tierId}`)
      .then(() => {
        alert('Tier deleted successfully!');
        setTierId('');
      })
      .catch((error) => {
        alert('Error deleting tier: ' + error.message);
      });
  };

  return (
    <div className="delete-form">
      <h2>Delete Tier</h2>
      <input
        type="text"
        placeholder="Enter Tier ID"
        value={tierId}
        onChange={(e) => setTierId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete Tier</button>
    </div>
  );
};

export default TierDelete;
