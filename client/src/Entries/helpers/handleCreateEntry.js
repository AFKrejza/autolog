import { SERVER_URL } from '../../App';

export async function handleCreateEntry(id, formData, setNotification, setEntries, setActiveForm) {

  const url = `${SERVER_URL}/entries/create`;
  let vehicleId = parseInt(id, 10); //TODO: just set it as id
  let year = formData.year;
  let month = formData.month;
  let day = formData.day;
  let description = formData.description;
  let cost = parseInt(formData.cost, 10);
  let mileage = parseInt(formData.mileage, 10);
  let mechanic = formData.mechanic;
  let category = formData.category.toLowerCase();
  let notes = formData.notes;

  //Validations array, cleaner than 10+ if/else statements, but slower since it always checks them all
  //Each check should be true, if false, then it'll send the msg notification (cuz of !check)
  //TODO: verify that cost is always a number, otherwise use isNan(cost)
  const validations = [
    { check: vehicleId && vehicleId > 0, msg: "Missing vehicleId"}, //this should never happen and should probably be handled by the backend if it does
    { check: year && year >= 0 && [4].includes(String(year).length), msg: "Invalid year: minimum 1800, must be 4 digits" },
    { check: month && month > 0 && month <= 12 && [1,2].includes(String(month).length), msg: "Invalid month: January = 1, February = 2, etc" },
    { check: day && day > 0 && day <= 31 && [1,2].includes(String(day).length), msg: "Invalid day: 1 - 31" },
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

  //now combine year month day once they've been validated
  let dayStr = String(day);
  let monthStr = String(month);
  if (dayStr.length === 1) {
    dayStr = String(day).padStart(2, "0");
  }
  if (monthStr.length === 1) {
    monthStr = String(month).padStart(2, "0")
  }
  let date = `${year}-${monthStr}-${dayStr}`;

  //check that date is valid (leap years etc)
  const checkDate = new Date(year, month -1, day +1).toJSON().slice(0,10);
  console.log(date);
  console.log(checkDate);
  if (date !== checkDate) {
    setNotification({ show: true, msg: "Invalid date" });
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
    setNotification({ show: true, msg: "Entry created" });
    console.log(json);
    setEntries(prevEntries => [json, ...prevEntries]);
    setActiveForm(null);

  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error creating entry" });    
  }
}