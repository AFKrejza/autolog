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
          <div className="vehicle-info">
            {activeVehicle && <ViewVehicle vehicle={activeVehicle} />}
          </div>
          <div className="entries">
          {activeVehicle && <VehicleEntries id={activeVehicle.id} />}
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

export function VehicleEntries({ id }) {
  const [entries, setEntries] = useState([]);
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
  let { make, model, year } = vehicle; //destructure
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
    //setActiveVehicle(json); //not needed
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

export default App;
