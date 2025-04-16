import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminForm.css';
const TierForm = () => {
  const [tierData, setTierData] = useState({
    tierName: '',
    screenId: '',
    screenNo: '',
    numberOfSeats: '',
    amount: '',
    theaterId: '',
  });
 
  const [screens, setScreens] = useState([]);
  const [theaters, setTheaters] = useState([]);
 
  useEffect(() => {
    axios.get('http://localhost:8080/theater/all')
      .then((response) => {
        setTheaters(response.data);
        console.log('Fetched theaters:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching theaters:', error);
      });
  }, []);
 
  useEffect(() => {
    if (tierData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenList/${tierData.theaterId}`)
        .then((response) => {
          setScreens(response.data);
          console.log(`Fetched screens for theaterId ${tierData.theaterId}:`, response.data);
        })
        .catch((error) => {
          console.error('Error fetching screens:', error);
        });
    }
  }, [tierData.theaterId]);
 
  // Fetch screenId when screenNo and theaterId are selected
  useEffect(() => {
    if (tierData.screenNo && tierData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenId?num=${tierData.screenNo}&theaterId=${tierData.theaterId}`)
        .then((response) => {
          setTierData((prevData) => ({ ...prevData, screenId: response.data }));
          console.log(`Fetched screenId for screenNo ${tierData.screenNo} and theaterId ${tierData.theaterId}:`, response.data);
        })
        .catch((error) => {
          console.error('Error fetching screenId:', error);
        });
    }
  }, [tierData.screenNo, tierData.theaterId]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTierData({ ...tierData, [name]: value });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    if (!tierData.screenId) {
      alert('Please select a valid screen.');
      return;
    }
 
    const requestBody = {
      tierName: tierData.tierName,
      seatCount: tierData.numberOfSeats,
      screen: { screenId: tierData.screenId },
      amount: tierData.amount,
    };
 
    console.log('Submitting tier data:', requestBody); 
 
    axios.post('http://localhost:8080/tier/addTier', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const createdTier = response.data;
      alert('Tier added successfully!');
      console.log('Created Tier:', createdTier);
 
      addSeats(createdTier.tierId, tierData.numberOfSeats);
 
      setTierData({
        tierName: '',
        screenId: '',
        screenNo: '',
        numberOfSeats: '',
        amount: '',
        theaterId: '',
      });
    })
    .catch((error) => {
      alert('Error adding tier: ' + error.message);
      console.error('Error adding tier:', error);
    });
  };
 
  const addSeats = (tierId, numberOfSeats) => {
    for (let i = 1; i <= numberOfSeats; i++) {
      const seatData = {
        seatNo: i,
        tier: { tierId: tierId },
      };
 
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
            disabled={!tierData.theaterId}
          >
            <option value="">Select a screen</option>
            {screens.map((screenNo) => (
  <option key={screenNo} value={screenNo}>
    Screen {screenNo}
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