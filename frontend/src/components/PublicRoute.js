import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function PublicRoute({ children }) {
    const token = localStorage.getItem("token");
    const emailId = localStorage.getItem("emailId"); // assuming you store this

    const [isValid, setIsValid] = useState(null); // null = loading, true = valid, false = invalid

    useEffect(() => {
        if (token && emailId) {
            axios.post(`http://localhost:8080/jwt/validate?token=${token}&emailId=${emailId}`)
                .then(() => setIsValid(true))
                .catch(() => setIsValid(false));
        } else {
            setIsValid(false); // no token = invalid
        }
    }, [token, emailId]);

    if (isValid === null) {
        return <p>Checking authentication...</p>; // or a spinner
    }

    if (isValid) {
        return <Navigate to="/main" replace />;
    }

    return children; // not authenticated, allow access to public route (e.g. login/register)
}

export default PublicRoute;
