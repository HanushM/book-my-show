import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TierForm = () => {
  // State to hold form data
  const [tierData, setTierData] = useState({
    tierName: '',
    screenId: '', // Screen selection (screenId)
    numberOfSeats: '', // Number of seats for the tier
    amount: '', // Amount for the tier
  });

  const [screens, setScreens] = useState([]);

  useEffect(() => {
    // Fetch available screens to allow user to select a screen
    axios.get('http://localhost:8080/screen/all')
      .then((response) => {
        setScreens(response.data); // Populate screen list from the backend
      })
      .catch((error) => {
        console.error('Error fetching screens:', error); // Handle errors
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTierData({ ...tierData, [name]: value }); // Update state on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Structure the data according to the request body format for the tier
    const requestBody = {
      tierName: tierData.tierName,
      seatCount: tierData.numberOfSeats,
      screen: { screenId: tierData.screenId },
      amount: tierData.amount,
    };

    // Send the structured data to the backend to add a tier
    axios.post('http://localhost:8080/tier/addTier', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const createdTier = response.data; // Get created tier data from the response
      alert('Tier added successfully!');

      // Now that the tier is created, add seats for the new tier
      addSeats(createdTier.tierId, tierData.numberOfSeats);
      
      // Reset form fields after success
      setTierData({
        tierName: '',
        screenId: '',
        numberOfSeats: '',
        amount: '',
      });
    })
    .catch((error) => {
      alert('Error adding tier: ' + error.message); // Handle errors
    });
  };

  // Function to add seats for the created tier
  const addSeats = (tierId, numberOfSeats) => {
    for (let i = 1; i <= numberOfSeats; i++) {
      const seatData = {
        seatNo: i,
        tier: { tierId: tierId }, // Reference the created tier
      };

      // Call the backend to add seats to the newly created tier
      axios.post('http://localhost:8080/seat/addSeat', seatData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(`Seat ${i} added successfully.`);
      })
      .catch((error) => {
        console.error('Error adding seat:', error);
      });
    }
  };

  return (
    <div className='upload'>
      <h1>Add New Tier</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tier Name:</label>
          <input
            type="text"
            name="tierName"
            value={tierData.tierName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Screen:</label>
          <select
            name="screenId"
            value={tierData.screenId}
            onChange={handleChange}
          >
            <option value="">Select a screen</option>
            {screens.map((screen) => (
              <option key={screen.screenId} value={screen.screenId}>
                {screen.screenName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Number of Seats:</label>
          <input
            type="number"
            name="numberOfSeats"
            value={tierData.numberOfSeats}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={tierData.amount}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Tier</button>
      </form>
    </div>
  );
};

export default TierForm;
