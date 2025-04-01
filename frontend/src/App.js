import {Routes,Route} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Otp from "./pages/Otp";
function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/otp" element={<Otp/>} />

      </Routes>
    </div>
  );
}

export default App;
