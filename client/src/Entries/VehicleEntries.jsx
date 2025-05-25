import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { SERVER_URL } from '../App';
import { handleDeleteEntry } from './helpers/handleDeleteEntry';

//NOTE: This function sets entry state and displays each page of entries.
export function VehicleEntries({ id, entries, setEntries, setActiveEntry, setNotification, setActiveForm, activePage, setActivePage }) {
  const url = `${SERVER_URL}/vehicles/${id}/entries`;

  useEffect( () => {
    if (!id) return;

    async function getEntries() {
      const response = await fetch(url);
      const json = await response.json();
      setEntries(json);
    }
    getEntries();
  }, [id, url, setEntries,]);

  //Pagination
  //activePage is 1 when activeVehicle state is set
  let start = (activePage -1) * 10;
  let end = start + 10;
  let entriesPage = entries.slice(start, end);

  let maxPage = Math.ceil(entries.length / 10);
  let minPage = 1;

  return (
    <>
    <div>
      Page: {activePage} / {maxPage}
    </div>
    <Table className="entry-table" striped bordered hover size="sm">
      <thead>
        <tr className="header">
          <th className="date">Date</th>
          <th>Description</th>
          <th>Cost</th>
          <th>Mileage</th>
          <th>Mechanic</th>
          <th>Category</th>
          <th className="notes">Notes</th>
          <th>Created at</th>
          <th>Updated at</th>
          <th>ID</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody className='body'>
      {entriesPage.map(entry => 
        <tr key={entry.id}>
        <td className="date">{entry.date}</td>
        <td className="notes">
          <div className="notes-content">{entry.description}</div></td>
        <td>{entry.cost}</td>
        <td>{entry.mileage}</td>
        <td>{entry.mechanic}</td>
        <td>{entry.category}</td>
        <td className='notes'>
          <div className='notes-content'>{entry.notes}</div></td>
        <td>{entry.createdAt}</td>
        <td>{entry.updatedAt}</td>
        <td>{entry.id}</td>
        <td>
          <Button
          variant="success"
            onClick={() => {
              setActiveEntry(entry);
              setActiveForm('updateEntry');
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
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
    <div>
    <Button onClick ={() => (activePage -1 >= minPage) ? setActivePage(activePage - 1) : null}>{'<'}</Button>
    <Button onClick ={() => (activePage +1 <= maxPage) ? setActivePage(activePage + 1) : null}>{'>'}</Button>
    </div>
    </>
  )
}