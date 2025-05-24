import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { handleUpdateEntry } from './helpers/handleUpdateEntry';

//create new entry - takes vehicle ID
export function UpdateEntryForm({ setNotification, setEntries, activeEntry, setActiveForm }) {

  //initialize the keys & empty values
  const [formData, setFormData] = useState({
    vehicleId: activeEntry.vehicleId,
    day: parseInt(activeEntry.date.slice(8)),
    month: parseInt(activeEntry.date.slice(5,7)),
    year: parseInt(activeEntry.date.slice(0, 4)),
    description: activeEntry.description,
    cost: activeEntry.cost,
    mileage: activeEntry.mileage,
    mechanic: activeEntry.mechanic,
    category: activeEntry.category,
    notes: activeEntry.notes,
    id: activeEntry.id
  });
  
  //Note: day month year are taken out of date. Date is remade in handleUpdateEntry after validation.
  useEffect(() => {
    if (activeEntry) {
      setFormData({
        vehicleId: activeEntry.vehicleId,
        day: parseInt(activeEntry.date.slice(8)),
        month: parseInt(activeEntry.date.slice(5,7)),
        year: parseInt(activeEntry.date.slice(0, 4)),
        description: activeEntry.description,
        cost: activeEntry.cost,
        mileage: activeEntry.mileage,
        mechanic: activeEntry.mechanic,
        category: activeEntry.category,
        notes: activeEntry.notes,
        id: activeEntry.id
      });
    }
  }, [activeEntry, setActiveForm]);

  //handle form change & update formData
  //fixed this to handle strings and numbers
  function handleChange(input) {
    const { name, value, type } = input.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value
    })
  }

  return (
    <>
        <Modal show onHide={() => setActiveForm(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formDay">
                <Form.Label>Day</Form.Label>
                <Form.Control
                  required
                  placeholder="Day (1-31)" //TODO: make this more user friendly!
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  type="number"
                  min={1}
                  minLength={1}
                  maxLength={2}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formMonth">
                <Form.Label>Month</Form.Label>
                <Form.Control
                  required
                  placeholder="Month (January = 1, etc)" //TODO: make this more user friendly!
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  type="number"
                  min={1}
                  minLength={1}
                  maxLength={2}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formYear">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  required
                  placeholder="Year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  type="number"
                  min={1800}
                  minLength={4}
                  maxLength={4}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  required
                  placeholder="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  type="text"
                  minLength={1}
                  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCost">
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  required
                  placeholder="Cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  type="number"
                  min={0}
                  minLength={1}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formMileage">
                <Form.Label>Mileage</Form.Label>
                <Form.Control
                  required
                  placeholder="Mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  type="number"
                  min={0}
                  minLength={1}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formMechanic">
                <Form.Label>Mechanic</Form.Label>
                <Form.Control
                  required
                  placeholder="Mechanic"
                  name="mechanic"
                  value={formData.mechanic}
                  onChange={handleChange}
                  type="text"
                  minLength={1}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  required
                  placeholder="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  type="text"
                  minLength={1}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formNotes">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  required
                  placeholder="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  type="text"
                  minLength={1}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setActiveForm(null)} variant="secondary">Cancel</Button>
            <Button onClick={async () => await handleUpdateEntry(formData, setNotification, setEntries, setActiveForm)}
            variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}