import {react,useState} from "react";
import { Link } from "react-router-dom";

function Register(){
    const[userName,setUserName]=useState("");
    const[password,setUserPassword]=useState("");
    const[userEmail,setUserEmail]=useState("");
    const[confirmpassword,setConfirmPassword]=useState("");
    const handleSubmit=(e)=>{
        e.preventDefault();
    }
    return(
        <div className="register">
            <form onSubmit={handleSubmit}>
                <label>Username: </label>
                <input type="text" value={userName} onChange={(e)=>{setUserName(e.target.value)}}/> <br></br>
                <label>Email ID: </label>
                <input type="email" value={userEmail} onChange={(e)=>{setUserEmail(e.target.value)}}/><br></br>
                <label>Password: </label>
                <input type="password" value={password} onChange={(e)=>{setUserPassword(e.target.value)}}/><br></br>
                <label>Confirm password: </label>
                <input type="password" value={confirmpassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/><br></br>
                <input type="submit" value="Register"/>
                <Link to="/login"><p>Already have an account?Login</p></Link>
            </form>
        </div>
    );
}
export default Register;