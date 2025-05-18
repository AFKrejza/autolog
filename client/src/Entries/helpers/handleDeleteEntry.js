import { SERVER_URL } from '../../App';

//only takes the id of vehicle to be deleted
export async function handleDeleteEntry(deleteId, setNotification, setEntries, setActiveEntry) {
  const url = `${SERVER_URL}/entries/delete`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        id: deleteId
      })
    })
    console.log(response);
    setEntries(prevEntries =>
      prevEntries.filter(e => e.id !== deleteId)
    );
    setActiveEntry();
    setNotification({ show: true, msg: `Entry ${deleteId} deleted`});
  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error deleting entry" });
  }
}