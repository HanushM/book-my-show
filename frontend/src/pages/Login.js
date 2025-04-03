import axios from "axios";
import {useEffect, useState} from "react";
import {Link,useNavigate} from "react-router-dom";
function Login(){
    const[userName,setUserName]=useState("");
    const[password,setUserPassword]=useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("token")){
            navigate("/main");
        }
    },[]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/user/verifyUser", {
                emailId: userName,
                password: password
            });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                alert("Login successful!");
                navigate("/main");
            }
        } catch (error) {
            alert("Invalid Credentials. Please try again.");
            console.error("Login failed:", error);
        }
    };
    return(
        <div className="login">
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input type="email" value={userName} onChange={(e)=>{setUserName(e.target.value)}}/><br></br>
                <label>Password: </label>
                <input type="password" value={password} onChange={(e)=>{setUserPassword(e.target.value)}}/><br></br>
                <input type="submit" value="Login"/>
                <Link to="/register"><p>Dont have an account?Create an account</p></Link>
            </form>
        </div>
    );
}
export default Login;