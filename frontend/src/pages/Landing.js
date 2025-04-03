import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect } from "react";

const Landing=()=>{
    const navigate = useNavigate("");

    useEffect(()=>{
        if(localStorage.getItem("token")){
            navigate("/main");
        }
    });
    
    return(
        <div className="landing">
            <header>
                <Header/>
                <Link to="/login"><button>Sign In</button></Link>
            </header>
            <section>
                <p>Welcome To BookMYShow</p>
                <p>It All Starts Here....</p>
                <button>Explore Now</button>
            </section>
            <Footer/>
        </div>
    );
}
export default Landing;