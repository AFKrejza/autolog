import './App.css';
import { useState } from 'react';

import { Notification } from './Components/Notification';
import { ListVehicles } from './Vehicles/ListVehicles';
import { ViewVehicle } from './Vehicles/ViewVehicle';
import { VehicleEntries } from './Entries/VehicleEntries';
import { NewVehicleForm } from './Vehicles/NewVehicleForm';
import { UpdateVehicleForm } from './Vehicles/UpdateVehicleForm';
import { DeleteVehicle } from './Vehicles/DeleteVehicle';
import { NewEntryForm } from './Entries/NewEntryForm';
import { UpdateEntryForm } from './Entries/UpdateEntryForm';

export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function App() {
  const [activeVehicle, setActiveVehicle] = useState();
  const [notification, setNotification] = useState({ show: false, msg: "" });
  const [vehicles, setVehicles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState();
  const [showEntryForm, setShowEntryForm] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Autolog</h1>
      </header>
      <div className="main">
        <div className="App-list">
          <h1>Vehicles</h1>
          
          <ListVehicles
          setActiveVehicle={setActiveVehicle}
          vehicles={vehicles}
          setVehicles={setVehicles} />
        </div>
        <div className="content">
          <Notification
          show={notification.show}
          msg={notification.msg}
          onClose={() => setNotification({ ...notification, show: false })}
          />
          <NewVehicleForm
          setActiveVehicle = {setActiveVehicle}
          vehicles={vehicles}
          setVehicles={setVehicles}
          setNotification={setNotification}
          />
          {activeVehicle && <UpdateVehicleForm
            setActiveVehicle = {setActiveVehicle}
            vehicles={vehicles}
            setVehicles={setVehicles}
            setNotification={setNotification}
            activeVehicle={activeVehicle}
          />}
          {activeVehicle && <DeleteVehicle
            setNotification={setNotification}
            id={activeVehicle.id}
            setVehicles={setVehicles}
            setActiveVehicle={setActiveVehicle}
          />}
          {activeVehicle && <NewEntryForm
          id={activeVehicle.id}
          setNotification={setNotification}
          setEntries={setEntries}
          />}
          {activeEntry && <UpdateEntryForm
            setNotification={setNotification}
            setEntries={setEntries}
            setActiveEntry={setActiveEntry}
            activeEntry={activeEntry}
            setShowEntryForm={setShowEntryForm}
            showEntryForm={showEntryForm}
          />}
          <div className="vehicle-info">
            {activeVehicle && <ViewVehicle vehicle={activeVehicle} />}
          </div>
          <div className="entries">
          {activeVehicle && <VehicleEntries
          id={activeVehicle.id}
          entries={entries}
          setEntries={setEntries}
          setActiveEntry={setActiveEntry}
          setShowEntryForm={setShowEntryForm}
          setNotification={setNotification}
          />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
