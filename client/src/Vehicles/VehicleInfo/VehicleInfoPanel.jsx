//where vehicle info, buttons, and stats page will go

import { ViewVehicle } from "../ViewVehicle";

export function VehicleInfoPanel({ vehicle }) {
  return (
  <div>
    {vehicle && <ViewVehicle vehicle={vehicle} />}
  </div>
  )
}
