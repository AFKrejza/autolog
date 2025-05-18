import Button from 'react-bootstrap/Button';

import { handleDeleteVehicle } from './helpers/handleDeleteVehicle';

//delete vehicle component
//TODO: add 'are you sure?'
export function DeleteVehicle({ id, setNotification, setVehicles, setActiveVehicle }) {
  return (
    <Button onClick={async () => await handleDeleteVehicle(id, setNotification, setVehicles, setActiveVehicle)} variant="primary">Delete Vehicle</Button>
  )
}
