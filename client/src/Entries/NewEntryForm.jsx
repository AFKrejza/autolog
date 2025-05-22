import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { handleCreateEntry } from './helpers/handleCreateEntry';

//TODO: There's gotta be a better way of doing this. Like creating a new Form.Group based on how many elements the form should have and their names.
//create new entry - takes vehicle ID
export function NewEntryForm({ id, setNotification, setEntries, setActiveForm }) {
  //const [showEntryForm, setShowEntryForm] = useState(false); //show or hide, default hide

  //clears fields when form is showed
  useEffect(() => {
    if (setActiveForm) {
      setFormData({
        day: "",
        month: "",
        year: "",
        description: "",
        cost: "",
        mileage: "",
        mechanic: "",
        category: "",
        notes: "",
      });
    }
  }, [setActiveForm]);

  //initialize the keys & empty values
  const [formData, setFormData] = useState({
    day: "",
    month: "",
    year: "",
    description: "",
    cost: "",
    mileage: "",
    mechanic: "",
    category: "",
    notes: "",
  });

  //handle form change & update formData
  function handleChange(input) {
    setFormData({
      ...formData,
      [input.target.name]: input.target.value
    })
  }

  //<Button onClick={() => setShowEntryForm(true)} variant="primary">New Entry</Button>
  return (
    <>
    
    {setActiveForm && (
      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal.Dialog>
          <Modal.Header closeButton onClick={() => setActiveForm(null)}>
            <Modal.Title>New Entry</Modal.Title>
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
            <Button onClick={async () => await handleCreateEntry(id, formData, setNotification, setEntries, setActiveForm)}
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