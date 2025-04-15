import axios from "axios";
import { useState, useEffect } from "react";

const Profile = () => {
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post("http://localhost:8080/jwt/decode", null, {
          params: { token },
        })
        .then((res) => {
          setUserEmail(res.data);
        })
        .catch((err) => {
          console.error("Failed to decode token", err);
        });
    }
  }, []);

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <p><strong>Email:</strong> {userEmail || "Loading..."}</p>
      <p><strong>Role:</strong> {userRole || "Unknown"}</p>
    </div>
  );
};

export default Profile;
