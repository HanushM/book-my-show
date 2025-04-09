import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TierForm = () => {
  // State to hold form data for the tier
  const [tierData, setTierData] = useState({
    tierName: '',
    screenId: '', // Screen selection (screenId)
    screenNo: '', // Screen number
    numberOfSeats: '', // Number of seats for the tier
    amount: '', // Amount for the tier
    theaterId: '', // Store selected theaterId
  });

  // State to hold available screens, theaters
  const [screens, setScreens] = useState([]);
  const [theaters, setTheaters] = useState([]);

  // Fetch theaters when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/theater/all')
      .then((response) => {
        setTheaters(response.data); // Populate theater list from the backend
      })
      .catch((error) => {
        console.error('Error fetching theaters:', error);
      });
  }, []);

  // Fetch screens based on the selected theaterId
  useEffect(() => {
    if (tierData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenList/${tierData.theaterId}`)
        .then((response) => {
          setScreens(response.data); // Populate screen list based on selected theater
        })
        .catch((error) => {
          console.error('Error fetching screens:', error);
        });
    }
  }, [tierData.theaterId]); // Dependency to fetch screens when theaterId changes

  // Fetch the screenId when screenNo and theaterId are selected
  useEffect(() => {
    if (tierData.screenNo && tierData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenId?screenNo=${tierData.screenNo}&theaterId=${tierData.theaterId}`)
        .then((response) => {
          setTierData((prevData) => ({ ...prevData, screenId: response.data }));
        })
        .catch((error) => {
          console.error('Error fetching screenId:', error);
        });
    }
  }, [tierData.screenNo, tierData.theaterId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTierData({ ...tierData, [name]: value }); // Update state on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if screenId is valid
    if (!tierData.screenId) {
      alert('Please select a valid screen.');
      return;
    }

    // Structure the data according to the request body format for the tier
    const requestBody = {
      tierName: tierData.tierName,
      seatCount: tierData.numberOfSeats,
      screen: { screenId: tierData.screenId }, // Ensure screenId is passed correctly
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
        screenNo: '', // Reset screenNo
        numberOfSeats: '',
        amount: '',
        theaterId: '', // Clear the theaterId field
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
          <label>Theater:</label>
          <select
            name="theaterId"
            value={tierData.theaterId}
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

        <div>
          <label>Screen:</label>
          <select
            name="screenNo"
            value={tierData.screenNo}
            onChange={handleChange}
            disabled={!tierData.theaterId}  // Disable until a theater is selected
          >
            <option value="">Select a screen</option>
            {screens.map((screen) => (
              <option key={screen.screenId} value={screen.screenNo}>
                Screen {screen.screenNo}
              </option>
            ))}
          </select>
        </div>

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
