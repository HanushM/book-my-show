import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";

const SeatsPage = () => {
  const { showId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const userEmail = "user@example.com"; // Replace with real user email in production
  const navigate=useNavigate();
  // Fetch seats from backend
  const fetchSeats = () => {
    axios
      .get(`http://localhost:8080/status/seats/${showId}`)
      .then((response) => {
        setSeats(response.data);
      })
      .catch((error) => console.error("Error fetching seats:", error));
  };

  useEffect(() => {
    fetchSeats();

    const interval = setInterval(() => {
      axios
        .put("http://localhost:8080/status/unlockExpired")
        .then(fetchSeats)
        .catch((error) => console.error("Error unlocking expired seats:", error));
    }, 5000);

    return () => clearInterval(interval);
  }, [showId]);

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

    if (seatObj.status === "AVAILABLE") {
      axios
        .post(`http://localhost:8080/status/lock`, null, {
          params: { showId, seatIds: seatId, userEmail },
        })
        .then(() => {
          setSelectedSeats((prev) => [...prev, seatId]);
          fetchSeats();
        })
        .catch((error) => console.error("Error locking seat:", error));
    } else if (seatObj.status === "LOCKED") {
      axios
        .put(`http://localhost:8080/status/release`, null, {
          params: { showId, seatIds: seatId, userEmail },
        })
        .then(() => {
          setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
          fetchSeats();
        })
        .catch((error) => console.error("Error releasing seat:", error));
    }
  };

  const handlePayClick = () => {
    axios.post("http://localhost:8080/payments/create", null, {
        params: {
            showId,
            emailId: userEmail,
            method: ""
        }
    }).then(response => {
        const paymentId = response.data;
        navigate(`/payment/${paymentId}`);
    }).catch(error => {
        console.error("Error creating payment:", error);
    });
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

  // Group seats by tier and sort by seatNo
  const groupSeatsByTier = (seats) => {
    const grouped = {};

    seats.forEach((seatObj) => {
      const tier = seatObj.seat.tier;
      const tierId = tier?.tierId;
      const tierName = tier?.tierName;

      if (!tierId) return;

      if (!grouped[tierId]) {
        grouped[tierId] = {
          tierName,
          seats: [],
        };
      }

      grouped[tierId].seats.push(seatObj);
    });

    // Sort seats in each tier by seatNo (which is integer)
    Object.values(grouped).forEach((group) => {
      group.seats.sort((a, b) => a.seat.seatNo - b.seat.seatNo);
    });

    return grouped;
  };


  const groupedSeats = groupSeatsByTier(seats);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Seats for Show ID: {showId}</h1>

      {Object.entries(groupedSeats).map(([tierId, group]) => (
        <div key={tierId} style={{ marginBottom: "30px" }}>
          <h2>
            Tier {group.tierName}
          </h2>

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
        <button
        style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        }}
        onClick={handlePayClick}
    >
        Pay ₹{totalPrice}
    </button>
      )}
    </div>
  );
};

export default SeatsPage;
