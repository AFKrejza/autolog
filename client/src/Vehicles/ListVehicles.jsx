import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { SERVER_URL } from '../App';

//get vehicle list
export function ListVehicles({ setActiveVehicle, vehicles, setVehicles, setActiveForm }) {
  const url = `${SERVER_URL}/vehicles/list`;

  useEffect( () => {
    async function getList() {
      const response = await fetch(url);
      const json = await response.json();
      setVehicles(json);
    }
    getList();
  }, []);

  return (
    <ListGroup>
      {vehicles.map(vehicle =>
    <ListGroup.Item
      key={vehicle.id}
      action
      onClick={() => {
        setActiveVehicle(vehicle);
        setActiveForm(null);
      }}>
      <div>{vehicle.make} {vehicle.model} {vehicle.year}</div>
      <div> Last updated: {vehicle.updatedAt}</div>
    </ListGroup.Item>
    )}
  </ListGroup>
  );
}