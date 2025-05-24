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
  setShowStats
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
        variant="secondary"
        onClick={() => {
          setShowStats(showStats => !showStats); //toggle button via update function
        }}
        >
          Statistics
        </Button>
        <Button
          onClick={() => {
            setActiveForm("updateVehicle");
          }}
          variant="success"
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
