import {useState} from "react";
import {Link} from "react-router-dom";
function Login(){
    const[userName,setUserName]=useState("");
    const[password,setUserPassword]=useState("");
    const handleSubmit=(e)=>{
        e.preventDefault();
         
    }
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