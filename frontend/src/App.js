import {Routes,Route} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Otp from "./pages/Otp";
import Main from "./pages/main";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Shows from "./pages/Shows";
import Seats from "./pages/Seats";
import Payment from "./pages/Payment";

function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
        <Route path="/shows" element={<PrivateRoute><Shows /></PrivateRoute>} />
        <Route path="/seats/:showId" element={<PrivateRoute><Seats /></PrivateRoute>} />
        <Route path="/payment/:paymentId" element={<PrivateRoute><Payment/></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
