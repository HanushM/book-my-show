import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/Payment.css";

const Payment = () => {
    const { paymentId } = useParams();
    const [status, setStatus] = useState(null);
    const [summary, setSummary] = useState(null);
    const [movieImage, setMovieImage] = useState(null);
    const ticketRef = useRef();

    useEffect(() => {
        axios.get(`http://localhost:8080/payments/summary?paymentId=${paymentId}`)
            .then(response => {
                setSummary(response.data);
                setStatus(response.data.status);
            })
            .catch(error => console.error("Error fetching payment summary:", error));
    }, [paymentId]);

    useEffect(() => {
        if (status === "SUCCESS" && summary?.movieName) {
            axios.get(`http://localhost:8080/movies/image/base64?name=${encodeURIComponent(summary.movieName)}`)
                .then(res => {
                    setMovieImage(`data:image/jpeg;base64,${res.data}`);
                })
                .catch(err => {
                    console.error("Error fetching movie image", err);
                });
        }
    }, [status, summary]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <Header />
            <h1>Payment Details</h1>

            {status === null && !summary ? (
                <p>Processing your payment...</p>
            ) : status === "FAILURE" ? (
                <>
                    <h2>Status: {status}</h2>
                    <p style={{ color: "red" }}>❌ Payment Failed. Please try again or contact support.</p>
                </>
            ) : status === "SUCCESS" && summary ? (
                <>
                    <h2>Status: {status}</h2>
                    <div
                        ref={ticketRef}
                        className="ticket"
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            padding: "20px",
                            display: "inline-block",
                            textAlign: "left",
                        }}
                    >
                        {movieImage && (
                            <div style={{ textAlign: "center", marginBottom: "15px" }}>
                                <img src={movieImage} alt="Movie Poster" style={{ width: "200px", borderRadius: "10px" }} />
                            </div>
                        )}

                        <h2>🎟️ Your Movie Ticket</h2>
                        <p><strong>Movie Name:</strong> {summary.movieName}</p>
                        <p><strong>Date:</strong> {summary.date}</p>
                        <p><strong>Time:</strong> {summary.startTime} - {summary.endTime}</p>
                        <p><strong>Screen Number:</strong> {summary.screenNumber}</p>
                        <p><strong>Theater:</strong> {summary.theaterName}</p>
                        <p><strong>Location:</strong> {summary.placeName}, Pin: {summary.pinCode}</p>

                        <p><strong>Seats:</strong><br />
                            {summary.tierSeats && Object.keys(summary.tierSeats).length > 0 ? (
                                Object.entries(summary.tierSeats).map(([tier, seats]) => (
                                    <span key={tier}>
                                        {tier} : {seats.join(", ")}<br />
                                    </span>
                                ))
                            ) : (
                                <span>No seat details available</span>
                            )}
                        </p>

                        <p><strong>Total Amount:</strong> ₹{summary.totalAmount}</p>
                    </div>
                    <br />
                    <button
                        onClick={handlePrint}
                        className="print-button"
                        style={{ marginTop: "20px" }}
                    >
                        🖨️ Print Ticket
                    </button>
                </>
            ) : null}
            <Footer />
        </div>
    );
};

export default Payment;
