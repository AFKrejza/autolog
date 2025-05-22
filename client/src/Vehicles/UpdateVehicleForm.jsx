import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { handleUpdateVehicle } from './helpers/handleUpdateVehicle';

//update vehicle component
//TODO: make a VehicleForm component and use it in create and update vehicle
export function UpdateVehicleForm({ setActiveVehicle, setVehicles, setNotification, activeVehicle, setActiveForm, activeForm }) {

  //initialize the keys & empty values
  const [formData, setFormData] = useState({
    make: activeVehicle.make,
    model: activeVehicle.model,
    year: activeVehicle.year,
    id: activeVehicle.id
  });

  useEffect(() => {
    if (activeVehicle) {
      setFormData({
        make: activeVehicle.make,
        model: activeVehicle.model,
        year: activeVehicle.year,
        id: activeVehicle.id
      });
    }
  }, [activeVehicle, activeForm]);

  //handle form change & update formData
  function handleChange(input) {
    setFormData({
      ...formData,
      [input.target.name]: input.target.value
    })
    //console.log(input.target.value);
  }

  return (
    <>
    {activeForm && (
      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal.Dialog>
          <Modal.Header closeButton onClick={() => setActiveForm(false)}>
            <Modal.Title>Update Vehicle</Modal.Title>
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
            <Button onClick={() => setActiveForm(false)} variant="secondary">Cancel</Button>
            <Button onClick={async () => await handleUpdateVehicle(formData, setActiveVehicle, setNotification, setVehicles, setActiveForm)}
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