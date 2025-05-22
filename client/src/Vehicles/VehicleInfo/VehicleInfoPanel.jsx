//where vehicle info, buttons, and stats page will go
import { ViewVehicle } from "../ViewVehicle";
import { DeleteVehicle } from "../DeleteVehicle";

import Button from "react-bootstrap/button";

export function VehicleInfoPanel({
  vehicle,
  setActiveForm,
  activeVehicle,
  setNotification,
  setVehicles,
  setActiveVehicle,
}) {
  return (
    <div>
      {vehicle && <ViewVehicle vehicle={vehicle} />}
      <div className="buttons">
        <Button
          onClick={() => {
            setActiveForm("newEntry");
          }}
          variant="primary"
        >
          New Entry
        </Button>
        <Button
          onClick={() => {
            setActiveForm("updateVehicle");
          }}
          variant="primary"
        >
          Update Vehicle
        </Button>
        {activeVehicle && (
          <DeleteVehicle
            setNotification={setNotification}
            id={activeVehicle.id}
            setVehicles={setVehicles}
            setActiveVehicle={setActiveVehicle}
          />
        )}
      </div>
    </div>
  );
}
