import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Autolog</h1>
        <p>
          <MyButton />
          <ListVehicles />
        </p>

      </header>
      <aside></aside>
    </div>
  );
}

function MyButton() {
  return (
    <button> I'm a button</button>
  )
}

const vehicles = [
  {
    make: "Skoda",
    model: "Fabia",
    year: "2020"
  },
  {
    make: "Skoda",
    model: "Fabia",
    year: "2020"
  }
]

export function ListVehicles() {
  const ListVehicles = vehicles.map(vehicle =>
    <li>{vehicle.make} {vehicle.model} {vehicle.year}</li>);
    return <ul>{ListVehicles}</ul>;
}

//get vehicle list
//use fetch
async function GetVehicles() {
  const url = "localhost:3000/vehicles/list";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log("List vehicles");
  }
  catch (error) {
    console.error(error.message);
  }
}

async function TEST() {
  const url = "localhost:3000/test";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log("List vehicles");
    return json;
  }
  catch (error) {
    console.error(error.message);
  }
}

export default App;
