import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Seat.css";
import chairAvailable from "../assets/images/chair-available.png";
import chairLocked from "../assets/images/chair-locked.png";
import chairBooked from "../assets/images/chair-booked.png";
import card from "../assets/images/card.png";
import gpay from "../assets/images/gpay.png";
import netbanking from "../assets/images/netbanking.png";
import paypal from "../assets/images/paypal.png";
const Seats = () => {
  const { showId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const [selectedMethod,setSelectedMethod] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .post("http://localhost:8080/jwt/decode", null, {
          params: { token },
        })
        .then((response) => setUserEmail(response.data))
        .catch((error) => console.error("Error decoding token:", error));
    }
  }, [token]);

  const fetchSeats = () => {
    axios
      .get(`http://localhost:8080/status/seats/${showId}`)
      .then((response) => setSeats(response.data))
      .catch((error) => console.error("Error fetching seats:", error));
  };

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(() => {
      axios
        .put("http://localhost:8080/status/unlockExpired")
        .then(fetchSeats)
        .catch((error) => console.error("Error unlocking expired seats:", error));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSeats.length === 0) {
      setTotalPrice(0);
      return;
    }
    const query = selectedSeats.map((id) => `seatIds=${id}`).join("&");
    axios
      .get(`http://localhost:8080/seat/prices?${query}`)
      .then((response) => {
        const prices = Object.values(response.data);
        setTotalPrice(prices.reduce((sum, price) => sum + price, 0));
      })
      .catch((error) => console.error("Error fetching seat prices:", error));
  }, [selectedSeats]);

  const handleSeatClick = (seatObj) => {
    const seatId = seatObj.seat.seatId;
    const seatIdsString = seatId.toString();
    if (seatObj.status === "AVAILABLE") {
      axios
        .post(`http://localhost:8080/status/lock`, null, {
          params: {
            showId,
            seatIds: seatIdsString,
            userEmail,
          },
        })
        .then(() => {
          setSelectedSeats((prev) => [...prev, seatId]);
          fetchSeats();
        })
        .catch((error) => console.error("Error locking seat:", error));
    } else if (seatObj.status === "LOCKED") {
      axios
        .put(`http://localhost:8080/status/release`, null, {
          params: {
            showId,
            seatIds: seatIdsString,
            userEmail,
          },
        })
        .then(() => {
          setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
          fetchSeats();
        })
        .catch((error) => console.error("Error releasing seat:", error));
    }
  };

  const handlePayClick = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/payments/create?showId=${showId}&emailId=${userEmail}`
      );
      setPaymentId(response.data);
      setShowConfirmPopup(true);
    } catch (err) {
      console.error("Payment creation failed", err);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/payments/status?paymentId=${paymentId}&method=${selectedMethod}`);
      setPaymentStatus(response.data);
      navigate(`/payment/${paymentId}`);
    } catch (err) {
      console.error("Payment confirmation failed", err);
    }
  };

  const handleCancelPayment = async () => {
    try {
     
      navigate(0);
    } catch (err) {
      console.error("Payment cancellation failed", err);
    }
  };

  

  function handleClick(value) {
    setSelectedMethod(value);
    console.log("Selected Value:", selectedMethod);
    
  }

  const handleCancelBooking = async () => {
    try {
      const seatString = selectedSeats.join(",");
      await axios.put(`http://localhost:8080/status/release`, seatString, {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          showId,
        },
      });
      navigate("/main");
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
  };

  const getSeatImage = (status, seatId) => {
    if (selectedSeats.includes(seatId)) return chairLocked;
    switch (status) {
      case "AVAILABLE":
        return chairAvailable;
      case "LOCKED":
        return chairLocked;
      case "BOOKED":
        return chairBooked;
      default:
        return chairAvailable;
    }
  };

  const groupSeatsByTier = (seats) => {
    const grouped = {};
    seats.forEach((seatObj) => {
      const tier = seatObj.seat.tier;
      const tierName = tier?.tierName;
      if (!tierName) return;
      if (!grouped[tierName]) {
        grouped[tierName] = { tierName, seats: [] };
      }
      grouped[tierName].seats.push(seatObj);
    });

    Object.values(grouped).forEach((group) =>
      group.seats.sort((a, b) => a.seat.seatNo - b.seat.seatNo)
    );

    const tierOrder = ["Silver", "Gold", "Platinum"];
    const sortedGroups = {};
    tierOrder.forEach((tierName) => {
      if (grouped[tierName]) {
        sortedGroups[tierName] = grouped[tierName];
      }
    });

    return sortedGroups;
  };

  const groupedSeats = groupSeatsByTier(seats);

  return (
    
    <div className="seat-page">
      <div className="screen">
  <div className="screen-arc">SCREEN</div>
</div>

      {Object.entries(groupedSeats).map(([tierName, group]) => (
        <div key={tierName} className="tier-section">
          <h2 className="tier-heading">Tier {group.tierName}</h2>
          <div className="seat-grid">
            {group.seats.map((seatObj) => (
              <img
                key={seatObj.statusId}
                src={getSeatImage(seatObj.status, seatObj.seat.seatId)}
                alt={`Seat ${seatObj.seat.seatNo}`}
                onClick={() =>
                  seatObj.status === "AVAILABLE" || selectedSeats.includes(seatObj.seat.seatId)
                    ? handleSeatClick(seatObj)
                    : null
                }
                title={`Seat ${seatObj.seat.seatNo}`}
                style={{
                  width: "40px",
                  height: "40px",
                  cursor:
                    seatObj.status === "AVAILABLE" || selectedSeats.includes(seatObj.seat.seatId)
                      ? "pointer"
                      : "not-allowed",
                  transform: "scale(1)",
                  transition: "transform 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedSeats.length > 0 && (
        <div className="seat-buttons">
          <button className="pay-btn" onClick={handlePayClick}>
            Pay ₹{totalPrice}
          </button>
         
        </div>
      )}

      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup">
           
          <p className="payment-title">Pay via</p>
  <div class="card-container">
  <div className="payment-card" onClick={() => handleClick('Credit Card')}>
  <img src={card} alt="Credit Card" />
</div>

<div className="payment-card" onClick={() => handleClick('Gpay')}>
  <img src={gpay} alt="Gpay" />
</div>
<div className="payment-card" onClick={() => handleClick('Paypal')}>
  <img src={paypal} alt="paypal" />
</div>
<div className="payment-card" onClick={() => handleClick('Net banking')}>
  <img src={netbanking} alt="Credit Card" />
</div>
</div>
<div className="button-group">
            <button className="confirm-btn" onClick={handleConfirmPayment}>Submit</button>
            <button className="cancel-btn" onClick={handleCancelPayment}>Cancel</button>
          </div>
          </div>
        </div>
      )}

      {paymentStatus && paymentStatus.paymentId && (
        <div className="payment-summary">
          <h2>Payment Details</h2>
          <p><strong>Payment ID:</strong> {paymentStatus.paymentId}</p>
          <p><strong>Email:</strong> {userEmail}</p>
          <p><strong>Amount:</strong> ₹{totalPrice}</p>
          <p><strong>Status:</strong> {paymentStatus.status}</p>
        </div>
      )}
    </div>
  );
};

export default Seats;
