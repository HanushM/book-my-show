import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShowsPage from "./Component/ShowsPage";
import SeatsPage from "./Component/SeatsPage";
import SeatManagement from "./Component/seat";
function App() {
  return (
    
    <Router>
      <Routes>
      
        <Route path="/" element={<ShowsPage />} />
        <Route path="/seats/:showId" element={<SeatsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
