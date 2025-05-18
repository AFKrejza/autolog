import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import { SERVER_URL } from '../../App';

//call api
//TODO: add error management
//TODO: update vehicle list
export async function handleCreateVehicle(vehicle, setActiveVehicle, setNotification, setVehicles, setshowVehicleForm) {
  const url = `${SERVER_URL}/vehicles/create`;
  let make = vehicle.make;
  let model = vehicle.model;
  let year = vehicle.year;
  let id = vehicle.id;
  year = parseInt(year, 10);
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
    //TODO: have vehicle list update (or just add the response to it? or does it update since activeVehicle updates?)
    //setActiveVehicle(vehicle); it should be json
    setVehicles(prevVehicles => [...prevVehicles, json]);
    setshowVehicleForm(false);

  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error creating vehicle" });    
    //TODO: show toast error notification with autohide
  }
}