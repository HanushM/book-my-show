import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeatForm = () => {
  const [seatData, setSeatData] = useState({
    seatNo: '',
    status: 'AVAILABLE', // Default status
    tierId: '', // Tier selection
    lockedBy: '', // User who locked the seat
    lockedUntil: '', // Date until the seat is locked
  });

  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    // Fetch tiers for selecting
    axios.get('http://localhost:8686/tier/all')
      .then((response) => {
        setTiers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tiers:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeatData({ ...seatData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the seat data before sending
    const formData = {
      seatNo: seatData.seatNo,
      status: seatData.status,
      tier: { tierId: seatData.tierId },
      lockedBy: seatData.lockedBy,
      lockedUntil: seatData.lockedUntil,
    };

    // Send POST request
    axios.post('http://localhost:8181/seat/addSeat', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      alert('Seat added successfully!');
      setSeatData({
        seatNo: '',
        status: 'AVAILABLE',
        tierId: '',
        lockedBy: '',
        lockedUntil: '',
      });
    })
    .catch((error) => {
      alert('Error adding seat: ' + error.message);
    });
  };

  return (
    <div className='upload'>
      <h1>Add New Seat</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Seat No:</label>
          <input
            type="number"
            name="seatNo"
            value={seatData.seatNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={seatData.status}
            onChange={handleChange}
          >
            <option value="AVAILABLE">Available</option>
            <option value="LOCKED">Locked</option>
            <option value="BOOKED">Booked</option>
            <option value="RESERVED">Reserved</option>
          </select>
        </div>
        <div>
          <label>Tier:</label>
          <select
            name="tierId"
            value={seatData.tierId}
            onChange={handleChange}
          >
            {tiers.map((tier) => (
              <option key={tier.tierId} value={tier.tierId}>
                {tier.tierName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Locked By:</label>
          <input
            type="text"
            name="lockedBy"
            value={seatData.lockedBy}
            onChange={handleChange}
            placeholder="Enter user ID (if locked)"
          />
        </div>
        <div>
          <label>Locked Until:</label>
          <input
            type="datetime-local"
            name="lockedUntil"
            value={seatData.lockedUntil}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Seat</button>
      </form>
    </div>
  );
};

export default SeatForm;
