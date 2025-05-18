import { SERVER_URL } from '../../App';

//only takes the id of vehicle to be deleted
export async function handleDeleteVehicle(id, setNotification, setVehicles, setActiveVehicle) {
  const url = `${SERVER_URL}/vehicles/delete`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        id: id
      })
    })
    console.log(response);
    setVehicles(prevVehicles =>
      prevVehicles.filter(v => v.id !== id)
    );
    setActiveVehicle();
    setNotification({ show: true, msg: `Vehicle ${id} deleted`});
  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error deleting vehicle" });
  }
}