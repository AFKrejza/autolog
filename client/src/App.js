import './App.css';
import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

//TODO: see if I should use path module

function App() {
  const [activeVehicle, setActiveVehicle] = useState();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Autolog</h1>
      </header>
      <div className="main">
        <div className="App-list">
          <h1>Vehicles</h1>
          <ListVehicles setActiveVehicle = {setActiveVehicle} />
        </div>
        <div className="content">
          {activeVehicle && <ViewVehicle vehicle={activeVehicle} />}
          <div className="entries">
          {activeVehicle && <VehicleEntries id={activeVehicle.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyButton() {
  return (
    <button> I'm a button</button>
  )
}

//get vehicle list
export function ListVehicles({ setActiveVehicle }) {
  const [vehicles, setVehicles] = useState([]);
  const url = "http://localhost:5000/vehicles/list";

  useEffect( () => {
    async function getList() {
      const response = await fetch(url);
      const json = await response.json();
      setVehicles(json);
    }
    getList();
  }, []);

  return (
    <ListGroup>
      {vehicles.map(vehicle =>
    <ListGroup.Item
      key={vehicle.id}
      action
      onClick={() => setActiveVehicle(vehicle)}
    >
      <div>{vehicle.make} {vehicle.model} {vehicle.year}</div>
      <div> Last updated: {vehicle.updatedAt}</div>
    </ListGroup.Item>
    )}
  </ListGroup>
  );
}

//display vehicle in middle of screen
//figure out how entries will be displayed: another function?
//THIS is a component!
export function ViewVehicle({ vehicle }) { //destructuring it
  //display all vehicle info
  if (!vehicle) return null;
  return <div>{vehicle.make} {vehicle.model} {vehicle.year}</div>;

}

export function VehicleEntries({ id }) {
  const [entries, setEntries] = useState([]);
  console.log(id);
  const url = `http://localhost:5000/vehicles/${id}/entries`;

  useEffect( () => {
    if (!id) return null;

    async function getEntries() {
      const response = await fetch(url);
      const json = await response.json();
      setEntries(json);
    }
    getEntries();
  }, [id]);
  return (
    <ListGroup>
      {entries.map(entry => 
      <ListGroup.Item
        key={entry.id}
        action
      >
        <div>{entry.date} {entry.description} {entry.cost} {entry.mileage} {entry.mechanic} {entry.category} {entry.notes} {entry.createdAt} {entry.updatedAt}</div>
      </ListGroup.Item>
      )}
    </ListGroup>
  )
}

export default App;
