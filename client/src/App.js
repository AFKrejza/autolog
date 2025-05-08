import './App.css';
import { useState, useEffect } from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Autolog</h1>
        <ListVehicles />
        <p>
          <MyButton />
        </p>
      </header>
    </div>
  );
}

export function MyButton() {
  return (
    <button> I'm a button</button>
  )
}

//get vehicle list
export function ListVehicles() {
  const [vehicles, setVehicles] = useState([]); //take vehicle object
  const url = "http://localhost:5000/vehicles/list";

  useEffect( () => {
    async function getList() {
      const response = await fetch(url);
      const json = await response.json();
      setVehicles(json);
    }
    getList();
  }, []);

  const list = vehicles ? vehicles.map(vehicle => <li>{vehicle.make} {vehicle.model} {vehicle.year}</li>) : <li>Loading...</li>;
  return <ul>{list}</ul>;
}

export default App;
