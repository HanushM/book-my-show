import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Register() {
    const [userName, setUserName] = useState("");
    const [password, setUserPassword] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8080/user/add", {
                emailId: userEmail,
                name: userName,
                mobileNo: mobileNo,
                password: password,
            });

            alert("User Registered Successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed!");
        }
    };

    return (
        <div className="register-page">
            <Header />
            <div className="register-content">
                <form onSubmit={handleSubmit}>
                    <label>Username: </label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                    <label>Email ID: </label>
                    <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
                    <label>Mobile No: </label>
                    <input type="number" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required />
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setUserPassword(e.target.value)} required />
                    <label>Confirm Password: </label>
                    <input type="password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <input type="submit" value="Register" />
                    <Link to="/login"><p>Already have an account? Login</p></Link>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Register;
