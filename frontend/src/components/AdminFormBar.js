import React, { useState } from 'react';
import MovieForm from './MovieForm';
import PlaceForm from './PlaceForm';
import ScreenForm from './ScreenForm';
import TheaterForm from './TheaterForm';
import TierForm from './TierForm';
import ShowForm from './ShowForm';


const AdminFormBar = () => {
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
            <li><button onClick={() => handleButtonClick('tier')}>Add Tier</button></li>
            <li><button onClick={() => handleButtonClick('show')}>Add Show</button></li>
          </ul>
        </nav>
      </header>

      <main>
        {currentForm === 'movie' && <MovieForm />}
        {currentForm === 'place' && <PlaceForm />}
        {currentForm === 'screen' && <ScreenForm />}
        {currentForm === 'theater' && <TheaterForm />}
        {currentForm === 'tier' && <TierForm />}
        {currentForm === 'show' && <ShowForm />}
      </main>
    </div>
  );
};

export default AdminFormBar;