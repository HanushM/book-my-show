import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect } from "react";
import "../styles/Landing.css";

const Landing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/main");
        }
    }, [navigate]);

    return (
        <div className="landing-page">
            <Header />
            <div className="landing-hero">
                <div className="landing-content">
                    <h1>Welcome to BookMyShow</h1>
                    <p>It All Starts Here...</p>
                    <button onClick={() => navigate("/login")}>Explore Now</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Landing;
