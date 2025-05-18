//display vehicle in middle of screen
//figure out how entries will be displayed: another function?
export function ViewVehicle({ vehicle }) { //destructuring it
  //display all vehicle info
  if (!vehicle) return null;
  return <div>{vehicle.make} {vehicle.model} {vehicle.year}</div>;
}