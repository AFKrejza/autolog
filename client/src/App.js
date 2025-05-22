import './App.css';
import { useState } from 'react';
import Button from 'react-bootstrap/button';

import { Notification } from './Components/Notification';
import { ListVehicles } from './Vehicles/ListVehicles';
import { VehicleEntries } from './Entries/VehicleEntries';
import { NewVehicleForm } from './Vehicles/NewVehicleForm';
import { UpdateVehicleForm } from './Vehicles/UpdateVehicleForm';
import { DeleteVehicle } from './Vehicles/DeleteVehicle';
import { NewEntryForm } from './Entries/NewEntryForm';
import { UpdateEntryForm } from './Entries/UpdateEntryForm';
import { VehicleInfoPanel } from './Vehicles/VehicleInfo/VehicleInfoPanel';

export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

//TODO: the UI is extremely buggy and doesn't work correctly
function App() {
  const [activeVehicle, setActiveVehicle] = useState();
  const [notification, setNotification] = useState({ show: false, msg: "" });
  const [vehicles, setVehicles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState();

  //this is pretty messy.
  //TODO: Issue: the forms all have their own states. Either have a global state, or use both show states correctly
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [newEntryForm, setNewEntryForm] = useState(false);
  const [updateEntryForm, setUpdateEntryForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [newVehicleForm, setNewVehicleForm] = useState(false);
  const [updateVehicleForm, setUpdateVehicleForm] = useState(false);

  //const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Autolog</h1>
      </header>
      <div className="main">
        <div className="App-list">
          <h1>Vehicles</h1>
          <Button onClick={() => {
            setActiveVehicle();
            setUpdateVehicleForm(false);
            setShowVehicleForm(true);
            setNewVehicleForm(true);
          }}>
          New Vehicle
          </Button>
          <ListVehicles
          setActiveVehicle={setActiveVehicle}
          vehicles={vehicles}
          setVehicles={setVehicles}
          setShowEntryForm={setShowEntryForm}
          setShowVehicleForm={setShowVehicleForm}
          />
        </div>
        <div className="content">
          <Notification
          show={notification.show}
          msg={notification.msg}
          onClose={() => setNotification({ ...notification, show: false })}
          />
          <div className="vehicle-info">
            {activeVehicle && <VehicleInfoPanel vehicle={activeVehicle} />}
          </div>
          <div className="buttons">
            <Button onClick={() => {
              setActiveEntry(false);
              setUpdateEntryForm(false);
              setNewEntryForm(true);
              setShowEntryForm(true);
            }} variant="primary">
              New Entry
            </Button>
            <Button onClick={() => {
              setShowVehicleForm(true);
              setUpdateVehicleForm(true);
              setShowEntryForm(false);
              }}
              variant="primary">
                Update Vehicle
            </Button>
            {activeVehicle && showVehicleForm && updateVehicleForm && <UpdateVehicleForm
            setActiveVehicle = {setActiveVehicle}
            vehicles={vehicles}
            setVehicles={setVehicles}
            setNotification={setNotification}
            activeVehicle={activeVehicle}
            setShowVehicleForm={setShowVehicleForm}
            showVehicleForm={showVehicleForm}
          />}
          {activeVehicle && <DeleteVehicle
            setNotification={setNotification}
            id={activeVehicle.id}
            setVehicles={setVehicles}
            setActiveVehicle={setActiveVehicle}
          />}
          
          {showVehicleForm && newVehicleForm && <NewVehicleForm
          setActiveVehicle = {setActiveVehicle}
          vehicles={vehicles}
          setVehicles={setVehicles}
          setNotification={setNotification}
          setNewVehicleForm={setNewVehicleForm}
          setShowVehicleForm={setShowVehicleForm}
          showVehicleForm={showVehicleForm}
          />}
          </div>
          {activeVehicle && showEntryForm && newEntryForm && <NewEntryForm
          id={activeVehicle.id}
          setNotification={setNotification}
          setEntries={setEntries}
          setShowEntryForm={setShowEntryForm}
          showEntryForm={showEntryForm}
          />}
          {activeEntry && showEntryForm && updateEntryForm && <UpdateEntryForm
            setNotification={setNotification}
            setEntries={setEntries}
            setActiveEntry={setActiveEntry}
            activeEntry={activeEntry}
            setShowEntryForm={setShowEntryForm}
            showEntryForm={showEntryForm}
            setNewEntryForm={setNewEntryForm}
            setUpdateEntryForm={setUpdateEntryForm}
          />}
          <div className="entries">
          {activeVehicle && <VehicleEntries
          id={activeVehicle.id}
          entries={entries}
          setEntries={setEntries}
          setActiveEntry={setActiveEntry}
          setShowEntryForm={setShowEntryForm}
          setNotification={setNotification}
          setNewEntryForm={setNewEntryForm}
          setUpdateEntryForm={setUpdateEntryForm}
          />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
