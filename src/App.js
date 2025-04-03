import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';

import './styles.css';
import AdminPanel from './pages/AdminPanel';

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
        
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
