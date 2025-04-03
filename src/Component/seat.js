import React, { useState } from "react";
import axios from "axios";

const SeatManagement = () => {
    const [theaterId, setTheaterId] = useState(""); // User inputs theater ID
    const [screens, setScreens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch screens based on theater ID
    const fetchScreens = async () => {
        if (!theaterId) {
            setMessage("Please enter a theater ID.");
            return;
        }

        setLoading(true);
        setMessage("");
        setScreens([]);

        try {
            console.log(`Fetching screens for theater ID: ${theaterId}`);
            const response = await axios.get(`http://localhost:8080/screen/theater/${theaterId}`);
            console.log("API Response:", response.data);

            if (Array.isArray(response.data) && response.data.length > 0) {
                setScreens(response.data);
                setMessage(`Fetched ${response.data.length} screens.`);
            } else {
                setMessage("No screens found for the given theater.");
            }
        } catch (error) {
            console.error("Error fetching screens:", error);
            setMessage("Error fetching screens. Please check the theater ID.");
        } finally {
            setLoading(false);
        }
    };

    // Function to generate and add seats
    const addSeats = async (tier) => {
        const seats = Array.from({ length: tier.seatCount }, (_, index) => ({
            seatNo: index + 1,
            status: "AVAILABLE",
            tier: { tierId: tier.tierId },
            lockedBy: null,
            lockedUntil: null,
        }));

        try {
            console.log(`Adding ${seats.length} seats for Tier: ${tier.tierName}`);
            await Promise.all(seats.map(seat => axios.post("http://localhost:8181/seat/addSeat", seat)));

            setMessage(`Successfully added ${seats.length} seats for ${tier.tierName}`);
        } catch (error) {
            console.error("Error adding seats:", error);
            setMessage("Error adding seats. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Seat Management</h2>

            <div className="mb-3">
                <label><b>Theater ID:</b></label>
                <input
                    type="number"
                    className="form-control"
                    value={theaterId}
                    onChange={(e) => setTheaterId(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={fetchScreens}>
                    Fetch Screens
                </button>
            </div>

            {loading && <p>Loading screens...</p>}
            {message && <p className="alert alert-info">{message}</p>}

            {screens.length > 0 && (
                <div>
                    <h4 className="mt-3">Fetched Screens:</h4>
                    {screens.map((screen) => (
                        <div key={screen.screenId} className="card mt-3 p-3">
                            <h4>{screen.screenName} (Capacity: {screen.capacity})</h4>
                            {screen.tiers && screen.tiers.length > 0 ? (
                                screen.tiers.map((tier) => (
                                    <div key={tier.tierId} className="mt-2">
                                        <p>
                                            <b>{tier.tierName}</b> - {tier.seatCount} seats
                                            <button
                                                className="btn btn-success btn-sm ms-3"
                                                onClick={() => addSeats(tier)}
                                            >
                                                Generate Seats
                                            </button>
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-danger">No tiers available for this screen.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SeatManagement;
