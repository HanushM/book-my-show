import axios from "axios";
import { useState,useEffect } from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({children}){
    const [isValid,setIsValid]=useState(null);
    const token = localStorage.getItem("token");
    useEffect(()=>{
        if(token){
            axios.post("http://localhost:8080/jwt/decode",null,{
                params:{token},
            })
            .then(response=>{
                const email=response.data;
                return axios.post("http://localhost:8080/jwt/validate",null,{
                    params:{token,emailId:email},
                })
            })
            .then(()=>{
                setIsValid(true);
            })
            .catch(()=>{
                setIsValid(false);
            })
        }else{
            setIsValid(false);
        }
    },[token]);
    if (isValid === null) return <div>Loading...</div>;
    return isValid ? children : <Navigate to="/" />;
};
export default PrivateRoute;