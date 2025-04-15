import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";
import "../styles/Header.css";
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
        setSidebarOpen(false);
    };

    const closeProfilePopup = () => {
        setShowProfilePopup(false);
    };

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <>
            <header className="header-container">
                <img src="Logo.png" alt="BookMyShow Logo" className="logo" />
                <img
                    src="user.png"
                    alt="User Icon"
                    onClick={handleProfileClick}
                    className="user-icon"
                />
            </header>

            {sidebarOpen && (
                <div className="sidebar">
                    <button className="close-btn" onClick={handleProfileClick}>X</button>

                    {!isLoggedIn ? (
                        <div>
                            <h3>Welcome Guest!</h3>
                            <button className="sidebar-btn" onClick={goToLogin}>Login</button>
                        </div>
                    ) : (
                        <div>
                            <h3>Welcome {role}</h3>
                            <ul className="sidebar-list">
                                <li><button className="sidebar-btn" onClick={openProfilePopup}>Your Profile</button></li>
                                {role === "admin" && (
                                    <li><button className="sidebar-btn" onClick={() => {
                                        onUploadClick();
                                        setSidebarOpen(false);
                                    }}>Upload</button></li>
                                )}
                                <li><button className="sidebar-btn" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {showProfilePopup && (
                <>
                    <div className="overlay"></div> {/* Add overlay */}
                    <div className="profile-popup open">
                        <button className="popup-close-btn" onClick={closeProfilePopup}>X</button>
                        <Profile />
                    </div>
                </>
            )}
        </>
    );
}

export default Header;
