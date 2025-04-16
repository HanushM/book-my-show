import React, { useState } from 'react';

// Upload Components
import MovieForm from '../Admin/Upload/MovieForm';
import PlaceForm from '../Admin/Upload/PlaceForm';
import ScreenForm from '../Admin/Upload/ScreenForm';
import TheaterForm from '../Admin/Upload/TheaterForm';
import TierForm from '../Admin/Upload/TierForm';
import ShowForm from '../Admin/Upload/ShowForm';

// Update Components
import MovieUpdateForm from '../Admin/Update/MovieUpdateForm';
import PlaceUpdateForm from '../Admin/Update/PlaceUpdateForm';
import ScreenUpdateForm from '../Admin/Update/ScreenUpdateForm';
import TheaterUpdateForm from '../Admin/Update/TheaterUpdateForm'; // Added
import TierUpdateForm from '../Admin/Update/TierUpdateForm';
import ShowUpdateForm from '../Admin/Update/ShowUpdateForm';

// Delete Components
import MovieDeleteForm from '../Admin/Delete/MovieDeleteForm';
import PlaceDeleteForm from '../Admin/Delete/PlaceDeleteForm';
import ScreenDeleteForm from '../Admin/Delete/ScreenDeleteForm';
import TheaterDeleteForm from '../Admin/Delete/TheaterDeleteForm'; // Added
import TierDeleteForm from '../Admin/Delete/TierDeleteForm';
import ShowDeleteForm from '../Admin/Delete/ShowDeleteForm';

const AdminFormBar = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedForm, setSelectedForm] = useState('');

  const tabOptions = {
    upload: [
      { label: 'Movie', component: <MovieForm /> },
      { label: 'Place', component: <PlaceForm /> },
      { label: 'Screen', component: <ScreenForm /> },
      { label: 'Theater', component: <TheaterForm /> },
      { label: 'Tier', component: <TierForm /> },
      { label: 'Show', component: <ShowForm /> },
    ],
    update: [
      { label: 'Movie', component: <MovieUpdateForm /> },
      { label: 'Place', component: <PlaceUpdateForm /> },
      { label: 'Screen', component: <ScreenUpdateForm /> },
      { label: 'Theater', component: <TheaterUpdateForm /> },  // Added
      { label: 'Tier', component: <TierUpdateForm /> },
      { label: 'Show', component: <ShowUpdateForm /> },
    ],
    delete: [
      { label: 'Movie', component: <MovieDeleteForm /> },
      { label: 'Place', component: <PlaceDeleteForm /> },
      { label: 'Screen', component: <ScreenDeleteForm /> },
      { label: 'Theater', component: <TheaterDeleteForm /> },  // Added
      { label: 'Tier', component: <TierDeleteForm /> },
      { label: 'Show', component: <ShowDeleteForm /> },
    ],
  };

  const handleFormClick = (formLabel) => {
    setSelectedForm(formLabel);
  };

  const renderSelectedForm = () => {
    const selected = tabOptions[activeTab].find(
      (form) => form.label === selectedForm
    );
    return selected?.component || <p>Please select a form.</p>;
  };

  return (
    <div className="admin-panel">
      <header>
        <h1>Admin Panel</h1>
        <div className="tabs">
          <button
            className={activeTab === 'upload' ? 'active' : ''}
            onClick={() => {
              setActiveTab('upload');
              setSelectedForm('');
            }}
          >
            Upload
          </button>
          <button
            className={activeTab === 'update' ? 'active' : ''}
            onClick={() => {
              setActiveTab('update');
              setSelectedForm('');
            }}
          >
            Update
          </button>
          <button
            className={activeTab === 'delete' ? 'active' : ''}
            onClick={() => {
              setActiveTab('delete');
              setSelectedForm('');
            }}
          >
            Delete
          </button>
        </div>

        <div className="form-selector">
          {tabOptions[activeTab].map((form) => (
            <button
              key={form.label}
              className={selectedForm === form.label ? 'selected' : ''}
              onClick={() => handleFormClick(form.label)}
            >
              {form.label}
            </button>
          ))}
        </div>
      </header>

      <main>
        {renderSelectedForm()}
      </main>

      <style jsx="true">{`
        .tabs button,
        .form-selector button {
          margin: 5px;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .tabs button.active,
        .form-selector button.selected {
          background-color: #007bff;
          color: white;
        }

        .form-selector {
          margin-top: 10px;
        }

        .admin-panel {
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default AdminFormBar;
