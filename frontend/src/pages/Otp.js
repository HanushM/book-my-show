import {react,useState} from "react";
function Otp(){
    const[firstValue,setFirstValue]=useState("");
    const[secondValue,setSecondValue]=useState("");
    const[thirdValue,setThirdValue]=useState("");
    const[fourthValue,setFourthValue]=useState("");
    const handleSubmit=(e)=>{
        e.preventDefault();
    }
    return(
        <div className="otp">
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="number" maxLength={1} value={firstValue} onChange={(e)=>{setFirstValue(e.target.value)}}/>
                    <input type="number" maxLength={1} value={secondValue} onChange={(e)=>{setSecondValue(e.target.value)}}/>
                    <input type="number" maxLength={1} value={thirdValue} onChange={(e)=>{setThirdValue(e.target.value)}}/>
                    <input type="number" maxLength={1} value={fourthValue} onChange={(e)=>{setFourthValue(e.target.value)}}/>
                    <input type="submit" value="submit"/>
                </form>
            </div>
        </div>
    );
}
export default Otp;