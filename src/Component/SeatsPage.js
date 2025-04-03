import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SeatsPage = () => {
    const { showId } = useParams();
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const userEmail = "user@example.com"; 

    const fetchSeats = () => {
        axios.get(`http://localhost:8080/status/seats/${showId}`)
            .then(response => {
                const sortedSeats = response.data.sort((a, b) => a.seat.seatId - b.seat.seatId);
                setSeats(sortedSeats);
            })
            .catch(error => console.error("Error fetching seats:", error));
    };

  useEffect(() => {
        fetchSeats();
        const interval = setInterval(() => {
            axios.put("http://localhost:8080/status/unlockExpired")
                .then(() => fetchSeats())
                .catch(error => console.error("Error unlocking expired seats:", error));
        }, 5000);
        return () => clearInterval(interval);
    }, [showId]);

   
    useEffect(() => {
        if (selectedSeats.length === 0) {
            setTotalPrice(0);
            return;
        }
        axios.get(`http://localhost:8080/seat/prices?${selectedSeats.map(id => `seatIds=${id}`).join("&")}`)
        .then(response => setTotalPrice(Object.values(response.data).reduce((sum, price) => sum + price, 0)))
        .catch(error => console.error("Error fetching seat prices:", error));
    }, [selectedSeats]);

   
    const handleSeatClick = (seat) => {
        if (seat.status === "AVAILABLE") {
            axios.post(`http://localhost:8080/status/lock`, null, {
                params: { showId, seatIds: seat.seat.seatId, userEmail }
            }).then(() => {
                setSelectedSeats([...selectedSeats, seat.seat.seatId]);
                fetchSeats();
            }).catch(error => console.error("Error locking seat:", error));
        } else if (seat.status === "LOCKED") {
            axios.put(`http://localhost:8080/status/release`, null, {
                params: { showId, seatIds: seat.seat.seatId, userEmail }
            }).then(() => {
                const updatedSeats = selectedSeats.filter(id => id !== seat.seat.seatId);
                setSelectedSeats(updatedSeats);
                fetchSeats();
            }).catch(error => console.error("Error releasing seat:", error));
        }
    };
    
    const getSeatColor = (status) => {
        switch (status) {
            case "AVAILABLE": return "blue";
            case "LOCKED": return "grey";
            case "BOOKED": return "green";
            default: return "white";
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Seats for Show ID: {showId}</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))", gap: "10px" }}>
                {seats.map(seat => (
                    <div key={seat.statusId}
                        onClick={() => handleSeatClick(seat)}
                        style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: getSeatColor(seat.status),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "5px",
                            color: "white",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}>
                        {seat.seat.seatId}
                    </div>
                ))}
            </div>

            {/* Pay Button */}
            {selectedSeats.length > 0 && (
                <button style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                    Pay {totalPrice}
                </button>
            )}
        </div>
    );
};

export default SeatsPage;
