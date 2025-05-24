import { SERVER_URL } from '../../App';

//call api
export async function handleCreateVehicle(vehicle, setActiveVehicle, setNotification, setVehicles, setActiveForm) {
  const url = `${SERVER_URL}/vehicles/create`;
  let make = vehicle.make;
  let model = vehicle.model;
  let year = vehicle.year;
  year = parseInt(year, 10);
  //validate data
  if (make.length < 1) {
    setNotification({ show: true, msg: "Invalid make" });
    return;
  }
  else if (model.length < 1) {
    setNotification({ show: true, msg: "Invalid model" });
    return;
  } 
  else if (year <= 0 || !Number.isInteger(year)) {
    setNotification({ show: true, msg: "Invalid year: must be integer" });
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }, //saying sending JSON
      body: JSON.stringify({
        make: make,
        model: model,
        year: year
      })
    });
    const json = await response.json();
    setActiveVehicle(json);
    setNotification({ show: true, msg: "Vehicle created" });
    console.log(json);
    setVehicles(prevVehicles => [...prevVehicles, json]);
    setActiveForm(null);

  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error creating vehicle" });    
  }
}