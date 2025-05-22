import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { handleCreateVehicle } from './helpers/handleCreateVehicle';

//create new vehicle component
//TODO: make a VehicleForm component and use it in create and update vehicle
export function NewVehicleForm({ setActiveVehicle, vehicles, setVehicles, setNotification, setActiveForm, activeForm }) {
  //const [showVehicleForm, setshowVehicleForm] = useState(false); //show or hide, default hide
  //const url = `${SERVER_URL}/vehicles/create`;

  //initialize the keys & empty values
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: ""
  });

  useEffect(() => {
    if (setActiveForm) {
      setFormData({
        make: "",
        model: "",
        year: "",
        id: ""
      });
    }
  }, [setActiveForm]);

  //handle form change & update formData
  function handleChange(input) {
    setFormData({
      ...formData,
      [input.target.name]: input.target.value
    })
    //console.log(input.target.value);
  }
  //<Button onClick={() => setshowVehicleForm(true)} variant="primary">New Vehicle</Button>
  return (
    <>
    {activeForm && (
      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal.Dialog>
          <Modal.Header closeButton onClick={() => setActiveForm()}>
            <Modal.Title>New Vehicle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formMake">
                <Form.Label>Make</Form.Label>
                <Form.Control
                  required
                  placeholder="Vehicle make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  type="text"
                  minLength={1}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formModel">
                <Form.Label>Model</Form.Label>
                <Form.Control
                  required
                  placeholder="Vehicle model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  type="text"
                  minLength={1}
                  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formYear">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  required
                  placeholder="Vehicle year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  type="number"
                  min={0}
                  minLength={1}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setActiveForm()} variant="secondary">Cancel</Button>
            <Button onClick={async () => await handleCreateVehicle(formData, setActiveVehicle, setNotification, setVehicles, setActiveForm)}
            variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )}
    </>
  )
}