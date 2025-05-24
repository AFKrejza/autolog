import Button from 'react-bootstrap/Button';

import { handleDeleteVehicle } from './helpers/handleDeleteVehicle';

//delete vehicle component
export function DeleteVehicle({ id, setNotification, setVehicles, setActiveVehicle }) {
  return (
    <Button variant="danger" onClick={async () => await handleDeleteVehicle(id, setNotification, setVehicles, setActiveVehicle)}>Delete Vehicle</Button>
  )
}
