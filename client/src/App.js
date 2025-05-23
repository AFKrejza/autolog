import "./App.css";
import { useState } from "react";
import Button from "react-bootstrap/button";

import { Notification } from "./Components/Notification";
import { ListVehicles } from "./Vehicles/ListVehicles";
import { VehicleEntries } from "./Entries/VehicleEntries";
import { NewVehicleForm } from "./Vehicles/NewVehicleForm";
import { UpdateVehicleForm } from "./Vehicles/UpdateVehicleForm";
import { NewEntryForm } from "./Entries/NewEntryForm";
import { UpdateEntryForm } from "./Entries/UpdateEntryForm";
import { VehicleInfoPanel } from "./Vehicles/VehicleInfo/VehicleInfoPanel";

export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

//TODO: the UI is extremely buggy and doesn't work correctly
function App() {
  const [activeVehicle, setActiveVehicle] = useState();
  const [notification, setNotification] = useState({ show: false, msg: "" });
  const [vehicles, setVehicles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState();
  const [activeForm, setActiveForm] = useState(null); //manages all forms. states: new- update- Entry / Vehicle

  return (
    <div className="App">
      <header className="App-header">
        <h1>Autolog</h1>
      </header>
      <div className="main">
        <div className="App-list">
          <h1>Vehicles</h1>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              setActiveForm("newVehicle");
            }}
          >
            New Vehicle
          </Button>
          <ListVehicles
            setActiveVehicle={setActiveVehicle}
            vehicles={vehicles}
            setVehicles={setVehicles}
            setActiveForm={setActiveForm}
          />
        </div>
        <div className="content">
          <div className="vehicle-info">
            {activeVehicle && (
              <VehicleInfoPanel
                vehicle={activeVehicle}
                setActiveForm={setActiveForm}
                activeVehicle={activeVehicle}
                setNotification={setNotification}
                setVehicles={setVehicles}
                setActiveVehicle={setActiveVehicle}
              />
            )}
          </div>
          <div className="entries">
            {activeVehicle && (
              <VehicleEntries
                id={activeVehicle.id}
                entries={entries}
                setEntries={setEntries}
                setActiveEntry={setActiveEntry}
                setNotification={setNotification}
                setActiveForm={setActiveForm}
              />
            )}
          </div>
        </div>
      </div>
      <Notification
        show={notification.show}
        msg={notification.msg}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      {activeForm === "newVehicle" && (
        <NewVehicleForm
          setActiveVehicle={setActiveVehicle}
          vehicles={vehicles}
          setVehicles={setVehicles}
          setNotification={setNotification}
          setActiveForm={setActiveForm}
          activeForm={activeForm}
        />
      )}
      {activeVehicle && activeForm === "updateVehicle" && (
        <UpdateVehicleForm
          setActiveVehicle={setActiveVehicle}
          setVehicles={setVehicles}
          setNotification={setNotification}
          activeVehicle={activeVehicle}
          setActiveForm={setActiveForm}
          activeForm={activeForm}
        />
      )}
      {activeVehicle && activeForm === "newEntry" && (
        <NewEntryForm
          id={activeVehicle.id}
          setNotification={setNotification}
          setEntries={setEntries}
          setActiveForm={setActiveForm}
        />
      )}
      {activeEntry && activeForm === "updateEntry" && (
        <UpdateEntryForm
          setNotification={setNotification}
          setEntries={setEntries}
          setActiveEntry={setActiveEntry}
          activeEntry={activeEntry}
          setActiveForm={setActiveForm}
        />
      )}
    </div>
  );
}

export default App;
