import { SERVER_URL } from '../../App';

//call api
//TODO: add error management
//TODO: update vehicle list
export async function handleUpdateVehicle(formData, setActiveVehicle, setNotification, setVehicles, setActiveForm) {
  const url = `${SERVER_URL}/vehicles/update`;
  //dont destructure, order could change.
  let make = formData.make;
  let model = formData.model;
  let year = formData.year;
  let id = formData.id;
  year = parseInt(year, 10);
  id = parseInt(id, 10);
  //validate data
  //TODO: Add an alert here for each one
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
  else if (id <= 0 || !Number.isInteger(id)) {
    setNotification({ show: true, msg: "Invalid ID: must be integer & vehicle must exist"}); //this should never happen, but check it anyway. The backend also verifies the ID properly.
  }

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }, //saying sending JSON
      body: JSON.stringify({
        make: make,
        model: model,
        year: year,
        id: id
      })
    });
    const updated = await response.json();
    //setActiveVehicle(updated); //not needed
    setNotification({ show: true, msg: "Vehicle updated" });
    //Updating the list: I could replace the vehicle, or i could get the list again. Replace it
    setVehicles(prevVehicles =>
      prevVehicles.map(v => v.id === updated.id ? updated : v)
    );

    setActiveForm();
  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error updating vehicle" });    
    //TODO: show toast error notification with autohide
  }
}