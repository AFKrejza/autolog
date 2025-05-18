import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { SERVER_URL } from '../App';
import { handleDeleteEntry } from './helpers/handleDeleteEntry';

export function VehicleEntries({ id, entries, setEntries, setActiveEntry, setShowEntryForm, setNotification }) {
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
          <th>Modify</th>
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
        <td>
          <Button
            onClick={() => {
              setActiveEntry(entry);
              setShowEntryForm(true);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={async () => {
              const deleteId = entry.id;
              setActiveEntry(entry);
              await handleDeleteEntry(deleteId, setNotification, setEntries, setActiveEntry);
            }}
          >
            Delete
          </Button>  
        </td>
        </tr>
      )}
      </tbody>
    </Table>
  )
}