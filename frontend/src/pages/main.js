
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Main(){
    const navigate = useNavigate();
    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = () => {
            window.history.pushState(null, "", window.location.href);
        };
    }, []);
    
    return (
        <div>
            <h1>Welcome to Main Page</h1>
            <button onClick={() => {
                localStorage.removeItem("token"); 
                navigate("/"); 
            }}>
                Logout
            </button>
        </div>
    );
}
export default Main;