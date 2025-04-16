import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TierUpdateForm = () => {
  const [tierData, setTierData] = useState({
    tierId: '',
    tierName: '',
    screenId: '',
    screenNo: '',
    numberOfSeats: '',
    amount: '',
    theaterId: '',
  });

  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [tiers, setTiers] = useState([]);

  // Fetch all theaters on mount
  useEffect(() => {
    axios.get('http://localhost:8080/theater/all')
      .then(res => setTheaters(res.data))
      .catch(err => console.error('Error fetching theaters:', err));
  }, []);

  // When theater is selected → fetch screens
  useEffect(() => {
    if (tierData.theaterId) {
      axios.get(`http://localhost:8080/screen/screenList/${tierData.theaterId}`)
        .then(res => setScreens(res.data))
        .catch(err => console.error('Error fetching screens:', err));
    }
  }, [tierData.theaterId]);

  // When screen is selected → fetch tiers
  useEffect(() => {
    if (tierData.screenId) {
      axios.get(`http://localhost:8080/tier/screen/${tierData.screenId}`)
        .then(res => setTiers(res.data))
        .catch(err => console.error('Error fetching tiers:', err));
    }
  }, [tierData.screenId]);

  // When tier is selected → fetch tier details
  useEffect(() => {
    if (tierData.tierId) {
      axios.get(`http://localhost:8080/tier/${tierData.tierId}`)
        .then(res => {
          const data = res.data;
          setTierData(prev => ({
            ...prev,
            tierName: data.tierName,
            numberOfSeats: data.seatCount,
            amount: data.amount,
          }));
        })
        .catch(err => console.error('Error fetching tier by ID:', err));
    }
  }, [tierData.tierId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTierData(prev => ({ ...prev, [name]: value }));

    // Reset tier details when screen/theater changes
    if (name === 'theaterId') {
      setTierData(prev => ({
        ...prev,
        screenId: '',
        screenNo: '',
        tierId: '',
        tierName: '',
        numberOfSeats: '',
        amount: '',
      }));
    }

    if (name === 'screenId') {
      setTierData(prev => ({
        ...prev,
        tierId: '',
        tierName: '',
        numberOfSeats: '',
        amount: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tierData.tierId) {
      alert("Please select a Tier to update.");
      return;
    }

    const payload = {
      tierName: tierData.tierName,
      seatCount: parseInt(tierData.numberOfSeats),
      amount: parseInt(tierData.amount),
      screen: { screenId: parseInt(tierData.screenId) }
    };

    axios.put(`http://localhost:8080/tier/update/${tierData.tierId}`, payload)
      .then(() => alert('Tier updated successfully!'))
      .catch(err => {
        console.error('Error updating tier:', err);
        alert('Failed to update tier.');
      });
  };

  return (
    <div className="upload">
      <h2>Tier Update</h2>
      <form onSubmit={handleSubmit}>
        {/* Theater Dropdown */}
        <div>
          <label>Theater:</label>
          <select name="theaterId" value={tierData.theaterId} onChange={handleChange} required>
            <option value="">Select a theater</option>
            {theaters.map(theater => (
              <option key={theater.theaterId} value={theater.theaterId}>
                {theater.theaterName}
              </option>
            ))}
          </select>
        </div>

        {/* Screen Dropdown */}
        <div>
          <label>Screen:</label>
          <select name="screenId" value={tierData.screenId} onChange={handleChange} required>
            <option value="">Select a screen</option>
            {screens.map(screen => (
              <option key={screen} value={screen}>
                Screen {screen}
              </option>
            ))}
          </select>
        </div>

        {/* Tier Dropdown */}
        <div>
          <label>Tier:</label>
          <select name="tierId" value={tierData.tierId} onChange={handleChange} required>
            <option value="">Select a tier</option>
            {tiers.map(tier => (
              <option key={tier.tierId} value={tier.tierId}>
                {tier.tierName}
              </option>
            ))}
          </select>
        </div>

        {/* Editable Fields */}
        {tierData.tierId && (
          <>
            <div>
              <label>Tier Name:</label>
              <input
                type="text"
                name="tierName"
                value={tierData.tierName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Number of Seats:</label>
              <input
                type="number"
                name="numberOfSeats"
                value={tierData.numberOfSeats}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={tierData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Update Tier</button>
          </>
        )}
      </form>
    </div>
  );
};

export default TierUpdateForm;
