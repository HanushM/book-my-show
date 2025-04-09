import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
 
const PaymentPage = () => {
    const { paymentId } = useParams();
    const [status, setStatus] = useState(null);
    const [amount, setAmount] = useState(null);
 
    useEffect(() => {
        axios.post(`http://localhost:8080/payments/status/${paymentId}`)
            .then(response => {
                setStatus(response.data.status);
                setAmount(response.data.amount);
            })
            .catch(error => {
                console.error("Error fetching payment status:", error);
                setStatus("ERROR");
            });
    }, [paymentId]);
 
    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Payment Status</h1>
            {status === null ? (
                <p>Processing your payment...</p>
            ) : (
                <div>
                    <h2>Status: {status}</h2>
                    {status !== "ERROR" && <p>Amount Paid: ₹{amount}</p>}
                </div>
            )}
        </div>
    );
};
 
export default PaymentPage;