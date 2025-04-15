import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function PrivateRoute({ children }) {
    const [isValid, setIsValid] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            axios.post("http://localhost:8080/jwt/decode", null, {
                params: { token },
            })
                .then((response) => {
                    const email = response.data;
                    return axios.post("http://localhost:8080/jwt/validate", null, {
                        params: { token, emailId: email },
                    });
                })
                .then(() => {
                    setIsValid(true);
                })
                .catch(() => {
                    // Cleanup token if invalid
                    localStorage.removeItem("token");
                    localStorage.removeItem("emailId");
                    setIsValid(false);
                });
        } else {
            setIsValid(false);
        }
    }, [token]);

    if (isValid === null) {
        return <p>Validating session...</p>;
    }

    if (isValid === false) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;
