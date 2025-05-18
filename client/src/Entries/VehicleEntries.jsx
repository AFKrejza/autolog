import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import { SERVER_URL } from '../App';

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