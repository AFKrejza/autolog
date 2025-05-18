import './App.css';
import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

//TODO: see if I should use path module
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function App() {
  const [activeVehicle, setActiveVehicle] = useState();
  const [notification, setNotification] = useState({ show: false, msg: "" });
  const [vehicles, setVehicles] = useState([]);
  const [entries, setEntries] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Autolog</h1>
      </header>
      <div className="main">
        <div className="App-list">
          <h1>Vehicles</h1>
          
          <ListVehicles
          setActiveVehicle={setActiveVehicle}
          vehicles={vehicles}
          setVehicles={setVehicles} />
        </div>
        <div className="content">
          <Notification
          show={notification.show}
          msg={notification.msg}
          onClose={() => setNotification({ ...notification, show: false })}
          />
          <NewVehicleForm
          setActiveVehicle = {setActiveVehicle}
          vehicles={vehicles}
          setVehicles={setVehicles}
          setNotification={setNotification}
          />
          {activeVehicle && <UpdateVehicleForm
            setActiveVehicle = {setActiveVehicle}
            vehicles={vehicles}
            setVehicles={setVehicles}
            setNotification={setNotification}
            activeVehicle={activeVehicle}
          />}
          {activeVehicle && <DeleteVehicle
            setNotification={setNotification}
            id={activeVehicle.id}
            setVehicles={setVehicles}
            setActiveVehicle={setActiveVehicle}
          />}
          {activeVehicle && <NewEntryForm
          id={activeVehicle.id}
          setNotification={setNotification}
          setEntries={setEntries}
          />}
          <div className="vehicle-info">
            {activeVehicle && <ViewVehicle vehicle={activeVehicle} />}
          </div>
          <div className="entries">
          {activeVehicle && <VehicleEntries
          id={activeVehicle.id}
          entries={entries}
          setEntries={setEntries}
          />}
          </div>
        </div>
      </div>
    </div>
  );
}

//get vehicle list
export function ListVehicles({ setActiveVehicle, vehicles, setVehicles }) {
  const url = `${SERVER_URL}/vehicles/list`;

  //TODO: make this a helper function and use it elsewhere, like in handleUpdateVehicle
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
      onClick={() => setActiveVehicle(vehicle)}
    >
      <div>{vehicle.make} {vehicle.model} {vehicle.year}</div>
      <div> Last updated: {vehicle.updatedAt}</div>
    </ListGroup.Item>
    )}
  </ListGroup>
  );
}

//display vehicle in middle of screen
//figure out how entries will be displayed: another function?
//THIS is a component!
export function ViewVehicle({ vehicle }) { //destructuring it
  //display all vehicle info
  if (!vehicle) return null;
  return <div>{vehicle.make} {vehicle.model} {vehicle.year}</div>;

}

export function VehicleEntries({ id, entries, setEntries }) {
  //console.log(id);
  const url = `${SERVER_URL}/vehicles/${id}/entries`;

  useEffect( () => {
    if (!id) return;

    async function getEntries() {
      const response = await fetch(url);
      const json = await response.json();
      setEntries(json);
    }
    getEntries();
  }, [id]);
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Cost</th>
          <th>Mileage</th>
          <th>Mechanic</th>
          <th>Category</th>
          <th>Notes</th>
          <th>Created at</th>
          <th>Updated at</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
      {entries.map(entry => 
        <tr key={entry.id}>
        <td>{entry.date}</td>
        <td>{entry.description}</td>
        <td>{entry.cost}</td>
        <td>{entry.mileage}</td>
        <td>{entry.mechanic}</td>
        <td>{entry.category}</td>
        <td>{entry.notes}</td>
        <td>{entry.createdAt}</td>
        <td>{entry.updatedAt}</td>
        <td>{entry.id}</td>
        </tr>
      )}
      </tbody>
    </Table>
  )
}

//create new vehicle component
//TODO: make a VehicleForm component and use it in create and update vehicle
export function NewVehicleForm({ setActiveVehicle, setNotification, vehicles, setVehicles }) {
  const [showVehicleForm, setshowVehicleForm] = useState(false); //show or hide, default hide
  //const url = `${SERVER_URL}/vehicles/create`;

  //initialize the keys & empty values
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: ""
  });

  useEffect(() => {
    if (showVehicleForm) {
      setFormData({
        make: "",
        model: "",
        year: "",
        id: ""
      });
    }
  }, [showVehicleForm]);

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
    <Button onClick={() => setshowVehicleForm(true)} variant="primary">New Vehicle</Button>
    {showVehicleForm && (
      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal.Dialog>
          <Modal.Header closeButton onClick={() => setshowVehicleForm(false)}>
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
            <Button onClick={() => setshowVehicleForm(false)} variant="secondary">Cancel</Button>
            <Button onClick={async () => await handleCreateVehicle(formData, setActiveVehicle, setNotification, setVehicles, setshowVehicleForm)}
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



//update vehicle component
//TODO: make a VehicleForm component and use it in create and update vehicle
export function UpdateVehicleForm({ setActiveVehicle, setNotification, vehicles, setVehicles, activeVehicle }) {
  const [showVehicleForm, setshowVehicleForm] = useState(false); //show or hide, default hide
  //const url = `${SERVER_URL}/vehicles/update`;

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
  }, [activeVehicle, showVehicleForm]);

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
    <Button onClick={() => setshowVehicleForm(true)} variant="primary">Update Vehicle</Button>
    {showVehicleForm && (
      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal.Dialog>
          <Modal.Header closeButton onClick={() => setshowVehicleForm(false)}>
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
            <Button onClick={() => setshowVehicleForm(false)} variant="secondary">Cancel</Button>
            <Button onClick={async () => await handleUpdateVehicle(formData, setActiveVehicle, setNotification, setVehicles, setshowVehicleForm)}
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

//call api
//TODO: add error management
//TODO: update vehicle list
export async function handleUpdateVehicle(formData, setActiveVehicle, setNotification, setVehicles, setshowVehicleForm) {
  const url = `${SERVER_URL}/vehicles/update`;
  //dont destructure, order could change.
  let make = formData.make;
  let model = formData.model;
  let year = formData.year;
  let id = formData.id;
  year = parseInt(year, 10);
  id = parseInt(id, 10);
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
  else if (id <= 0 || !Number.isInteger(id)) {
    setNotification({ show: true, msg: "Invalid ID: must be integer & vehicle must exist"}); //this should never happen, but check it anyway. The backend also verifies the ID properly.
  }
  console.log(id);

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }, //saying sending JSON
      body: JSON.stringify({
        make: make,
        model: model,
        year: year,
        id: id
      })
    });
    const updated = await response.json();
    setActiveVehicle(updated); //not needed
    setNotification({ show: true, msg: "Vehicle updated" });
    console.log(updated);
    //Updating the list: I could replace the vehicle, or i could get the list again. Replace it
    setVehicles(prevVehicles =>
      prevVehicles.map(v => v.id === updated.id ? updated : v)
    );

    setshowVehicleForm(false);
  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error updating vehicle" });    
    //TODO: show toast error notification with autohide
  }
}

//delete vehicle component
//TODO: add 'are you sure?'
export function DeleteVehicle({ id, setNotification, setVehicles, setActiveVehicle }) {
  return (
    <Button onClick={async () => await handleDeleteVehicle(id, setNotification, setVehicles, setActiveVehicle)} variant="primary">Delete Vehicle</Button>
  )
}

//only takes the id of vehicle to be deleted
export async function handleDeleteVehicle(id, setNotification, setVehicles, setActiveVehicle) {
  const url = `${SERVER_URL}/vehicles/delete`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        id: id
      })
    })
    console.log(response);
    setVehicles(prevVehicles =>
      prevVehicles.filter(v => v.id !== id)
    );
    setActiveVehicle();
    setNotification({ show: true, msg: `Vehicle ${id} deleted`});
  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error deleting vehicle" });
  }
}

//notification component
export function Notification({ show, msg, onClose }) {
  //const [show, setShow] = useState(false);

  return (
    <Row>
      <Col xs={6}>
        <Toast onClose={onClose} show={show} delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">Message</strong>
          </Toast.Header>
          <Toast.Body>
            {msg}
          </Toast.Body>
        </Toast>
      </Col>
    </Row>
  );
}

//TODO: There's gotta be a better way of doing this. Like creating a new Form.Group based on how many elements the form should have and their names.
//create new entry - takes vehicle ID
export function NewEntryForm({ id, setNotification, setEntries }) {
  const [showEntryForm, setShowEntryForm] = useState(false); //show or hide, default hide

  //clears fields when form is showed
  useEffect(() => {
    if (showEntryForm) {
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
  }, [showEntryForm]);

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

  return (
    <>
    <Button onClick={() => setShowEntryForm(true)} variant="primary">New Entry</Button>
    {showEntryForm && (
      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal.Dialog>
          <Modal.Header closeButton onClick={() => setShowEntryForm(false)}>
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
            <Button onClick={() => setShowEntryForm(false)} variant="secondary">Cancel</Button>
            <Button onClick={async () => await handleCreateEntry(id, formData, setNotification, setEntries, setShowEntryForm)}
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

//TODO: update entry list
export async function handleCreateEntry(id, formData, setNotification, setEntries, setShowEntryForm) {
  //validate date (day, month, year

  console.log(id);
  const url = `${SERVER_URL}/entries/create`;
  let vehicleId = parseInt(id, 10); //TODO: just set it as id
  let year = formData.year;
  let month = formData.month;
  let day = formData.day;
  let description = formData.description;
  let cost = parseInt(formData.cost, 10);
  let mileage = parseInt(formData.mileage, 10);
  let mechanic = formData.mechanic;
  let category = formData.category;
  let notes = formData.notes;
  console.log(year, month, day);

  //Validations array, cleaner than 10+ if/else statements, but slower since it always checks them all
  //Each check should be true, if false, then it'll send the msg notification (cuz of !check)
  //TODO: verify that cost is always a number, otherwise use isNan(cost)
  const validations = [
    { check: vehicleId && vehicleId > 0, msg: "Missing vehicleId"}, //TODO: this should never happen and should probably be handled by the backend if it does
    { check: year && year >= 0 && [4].includes(year.length), msg: "Invalid year: minimum 1800" },
    { check: month && month > 0 && month <= 12 && [1,2].includes(month.length), msg: "Invalid month: January = 1, February = 2, etc" },
    { check: day && day > 0 && day <= 31 && [1,2].includes(day.length), msg: "Invalid day: 1 - 31" },
    { check: description, msg: "Missing description" },
    { check: cost && cost >= 0, msg: "Invalid cost: must be integer 0 or greater" },
    { check: mileage && mileage >= 0, msg: "Invalid mileage: must be 0 or greater" },
    { check: mechanic, msg: "Invalid mechanic" },
    { check: category, msg: "Invalid category" },
    { check: notes, msg: "Invalid notes" },
  ];

  for (const { check, msg } of validations) { //destructuring
    if (!check) {
      setNotification({ show: true, msg });
      return;
    }
  }

  //TODO: add leap year and precise date validation (find a function or component that can do it)
  //if (day >= 29 && month == 2 && year % 4 == 0) {
  //  if (year % 100 == 0) return;
  //  if (year % 400 == 0) return false;
  //}

  //now combine year month day once they've been validated
  //use padStart method: this could just be a function but alas, time constraint
  let dayStr = day;
  let monthStr = month;
  if (day.length == 1) {
    dayStr = String(day).padStart(2, "0");
  }
  if (month.length == 1) {
    monthStr = String(month).padStart(2, "0")
  }
  let date = `${year}-${monthStr}-${dayStr}`;
  console.log(date);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }, //saying sending JSON
      body: JSON.stringify({
        vehicleId: vehicleId,
        date: date,
        description: description,
        cost: cost,
        mileage: mileage,
        mechanic: mechanic,
        category: category,
        notes: notes,
      })
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      setNotification({show: true, msg: `Error: ${errorMsg}`});
      console.error(`${errorMsg}, HTTP error:`, response.status);
    }
    const json = await response.json();
    //setActiveVehicle(json);
    setNotification({ show: true, msg: "Entry created" });
    console.log(json);
    //TODO: have vehicle list update (or just add the response to it? or does it update since activeVehicle updates?)
    //setActiveVehicle(vehicle); it should be json
    //setVehicles(prevVehicles => [...prevVehicles, json]);
    setEntries(prevEntries => [...prevEntries, json]);
    setShowEntryForm(false);

  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error creating entry" });    
    //TODO: show toast error notification with autohide
  }
}

export default App;
