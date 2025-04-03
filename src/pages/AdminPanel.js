import React, { useState } from 'react';
import MovieForm from '../admin/MovieForm';
import PlaceForm from '../admin/PlaceForm';
import ScreenForm from '../admin/ScreenForm';
import TheaterForm  from '../admin/TheaterForm';
import TierForm from '../admin/TierForm';
//import SeatForm from '../admin/SeatForm';


const AdminPanel = () => {
  const [currentForm, setCurrentForm] = useState('');

  const handleButtonClick = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="admin-panel">
      <header>
        <h1>Admin Panel</h1>
        <nav>
          <ul>
            <li><button onClick={() => handleButtonClick('movie')}>Upload Movie</button></li>
            <li><button onClick={() => handleButtonClick('place')}>Add Place</button></li>
            <li><button onClick={() => handleButtonClick('screen')}>Add Screen</button></li>
            <li><button onClick={() => handleButtonClick('theater')}>Add Theater</button></li>
            {/*<li><button onClick={() => handleButtonClick('seat')}>Add Seat</button></li>*/}
            <li><button onClick={() => handleButtonClick('tier')}>Add Tier</button></li>
          </ul>
        </nav>
      </header>

      <main>
        {currentForm === 'movie' && <MovieForm />}
        {currentForm === 'place' && <PlaceForm />}
        {currentForm === 'screen' && <ScreenForm />}
        {currentForm === 'theater' && <TheaterForm />}
        {/*{currentForm === 'seat' && <SeatForm />}*/}
        {currentForm === 'tier' && <TierForm />}
      </main>
    </div>
  );
};

export default AdminPanel;
