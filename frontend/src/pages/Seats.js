import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import qs from "qs"; // qs for correctly handling array parameters

const Seats = () => {
  const { showId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // Add state to store payment status

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Decode token and get user email
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

  // Fetch seats for the show
  const fetchSeats = () => {
    axios
      .get(`http://localhost:8080/status/seats/${showId}`)
      .then((response) => setSeats(response.data))
      .catch((error) => console.error("Error fetching seats:", error));
  };

  // Auto-unlock expired seats every second
  useEffect(() => {
    fetchSeats();
    const interval = setInterval(() => {
      axios
        .put("http://localhost:8080/status/unlockExpired")
        .then(fetchSeats)
        .catch((error) =>
          console.error("Error unlocking expired seats:", error)
        );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total price for selected seats
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

  // Lock or unlock seats on click
  const handleSeatClick = (seatObj) => {
    const seatId = seatObj.seat.seatId;
    const seatNo = seatObj.seat.seatNo;
    console.log("Seat clicked => SeatNo:", seatNo, "| SeatId:", seatId);

    const seatIdsString = seatId.toString(); // ✅ backend expects comma-separated string

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

  // Create payment
  const handlePayClick = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/payments/create?showId=${showId}&emailId=${userEmail}&method=CARD`
      );
      setPaymentId(response.data);
      setShowConfirmPopup(true);
    } catch (err) {
      console.error("Payment creation failed", err);
    }
  };

  // Confirm payment
  const handleConfirmPayment = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/payments/status/${paymentId}`);
      setPaymentStatus(response.data); // Store payment status response
      navigate(`/payment/${paymentId}`);
    } catch (err) {
      console.error("Payment confirmation failed", err);
    }
  };

  const handleClosePopup = () => {
    setShowConfirmPopup(false);
  };

  const handleCancelBooking = async () => {
    try {
      const seatString = selectedSeats.join(","); // Convert array to comma-separated string
      await axios.put(
        `http://localhost:8080/status/release`,
        seatString, // Send as body (plain text)
        {
          headers: {
            "Content-Type": "text/plain", // Important!
          },
          params: {
            showId,
          },
        }
      );
      navigate("/main");
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
  };

  const getSeatColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "blue";
      case "LOCKED":
        return "grey";
      case "BOOKED":
        return "green";
      default:
        return "white";
    }
  };

  const groupSeatsByTier = (seats) => {
    const grouped = {};
    seats.forEach((seatObj) => {
      const tier = seatObj.seat.tier;
      const tierId = tier?.tierId;
      const tierName = tier?.tierName;
      if (!tierId) return;
      if (!grouped[tierId]) {
        grouped[tierId] = { tierName, seats: [] };
      }
      grouped[tierId].seats.push(seatObj);
    });
    Object.values(grouped).forEach((group) =>
      group.seats.sort((a, b) => a.seat.seatNo - b.seat.seatNo)
    );
    return grouped;
  };

  const groupedSeats = groupSeatsByTier(seats);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Seats for Show ID: {showId}</h1>

      {Object.entries(groupedSeats).map(([tierId, group]) => (
        <div key={tierId} style={{ marginBottom: "30px" }}>
          <h2>Tier {group.tierName}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
              gap: "10px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {group.seats.map((seatObj) => (
              <div
                key={seatObj.statusId}
                onClick={() => handleSeatClick(seatObj)}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: getSeatColor(seatObj.status),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "5px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {seatObj.seat.seatNo}
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedSeats.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginRight: "10px",
            }}
            onClick={handlePayClick}
          >
            Pay ₹{totalPrice}
          </button>

          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
            onClick={handleCancelBooking}
          >
            Cancel Booking
          </button>
        </div>
      )}

      {showConfirmPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            <h2>Confirm Payment</h2>
            <p>Proceed with payment of ₹{totalPrice} for selected seats.</p>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
              }}
              onClick={handleConfirmPayment}
            >
              Confirm
            </button>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={handleClosePopup}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Check if paymentStatus is available before rendering */}
      {paymentStatus && paymentStatus.paymentId && (
        <div>
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
