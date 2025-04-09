import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Payment from './pages/Payment';

import './styles.css';
import AdminPanel from './pages/AdminPanel';

import ShowsPage from './pages/ShowsPage';
import SeatsPage from './pages/SeatsPage';
import PaymentPage from './pages/PaymentPage';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <NavBar />
        <Routes>
      
          <Route exact path="/" element={<Home />} />

          <Route path="/movies" element={<Movies />} />


          <Route path="/admin" element={<AdminPanel/>} />

          <Route path="/payment" element={<Payment/>} />

          <Route path="/shows" element={<ShowsPage />} />

          <Route path="/seats/:showId" element={<SeatsPage />} />

          <Route path="/payment/:paymentId" element={<PaymentPage />} />
        
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
