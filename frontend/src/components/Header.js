import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile"; 

function Header({ onUploadClick }) {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const isLoggedIn = !!localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleProfileClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const openProfilePopup = () => {
        setShowProfilePopup(true);
        setSidebarOpen(false); // close sidebar when profile opens
    };

    const closeProfilePopup = () => {
        setShowProfilePopup(false);
    };

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#eee" }}>
                <img src="logo.png" alt="BookMyShow Logo" style={{ height: "50px" }} />
                <img
                    src="user.png"
                    alt="User Icon"
                    onClick={handleProfileClick}
                    style={{ height: "40px", cursor: "pointer" }}
                />
            </header>

            {sidebarOpen && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "250px",
                    height: "100vh",
                    backgroundColor: "#fff",
                    boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
                    padding: "1rem",
                    zIndex: 1000
                }}>
                    <button onClick={handleProfileClick} style={{ float: "right" }}>X</button>

                    {!isLoggedIn ? (
                        <div>
                            <h3>Welcome Guest!</h3>
                            <button onClick={goToLogin}>Login</button>
                        </div>
                    ) : (
                        <div>
                            <h3>Welcome {role}</h3>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                <li><button onClick={openProfilePopup}>Your Profile</button></li>
                                {role === "admin" && (
                                    <li><button onClick={() => {
                                        onUploadClick();
                                        setSidebarOpen(false);
                                    }}>Upload</button></li>
                                )}
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Profile Popup Modal */}
            {showProfilePopup && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#fff",
                    padding: "2rem",
                    borderRadius: "10px",
                    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                    zIndex: 2000,
                    minWidth: "300px"
                }}>
                    <button onClick={closeProfilePopup} style={{ float: "right", fontSize: "1.2rem" }}>X</button>
                    <Profile />
                </div>
            )}
        </>
    );
}

export default Header;
