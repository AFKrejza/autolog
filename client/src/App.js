import './App.css';
import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

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
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Cost</th>
          <th>Mileage</th>
          <th>Mechanic</th>
          <th>Category</th>
          <th>Notes</th>
          <th>Created at</th>
          <th>Updated at</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
      {entries.map(entry => 
        <tr key={entry.id}>
        <td>{entry.date}</td>
        <td>{entry.description}</td>
        <td>{entry.cost}</td>
        <td>{entry.mileage}</td>
        <td>{entry.mechanic}</td>
        <td>{entry.category}</td>
        <td>{entry.notes}</td>
        <td>{entry.createdAt}</td>
        <td>{entry.updatedAt}</td>
        <td>{entry.id}</td>
        </tr>
      )}
      </tbody>
    </Table>
  )
}

export default App;
