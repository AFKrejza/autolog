import { SERVER_URL } from '../../App';

//TODO: update entry list
export async function handleCreateEntry(id, formData, setNotification, setEntries, setActiveForm) {
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
  let category = formData.category.toLowerCase();
  let notes = formData.notes;
  console.log(year, month, day);

  //Validations array, cleaner than 10+ if/else statements, but slower since it always checks them all
  //Each check should be true, if false, then it'll send the msg notification (cuz of !check)
  //TODO: verify that cost is always a number, otherwise use isNan(cost)
  const validations = [
    { check: vehicleId && vehicleId > 0, msg: "Missing vehicleId"}, //TODO: this should never happen and should probably be handled by the backend if it does
    { check: year && year >= 0 && [4].includes(year.length), msg: "Invalid year: minimum 1800, must be 4 digits" },
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
  if (day.length === 1) {
    dayStr = String(day).padStart(2, "0");
  }
  if (month.length === 1) {
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
    setEntries(prevEntries => [json, ...prevEntries]);
    setActiveForm(null);

  }
  catch (error) {
    console.error(error);
    setNotification({ show: true, msg: "Error creating entry" });    
    //TODO: show toast error notification with autohide
  }
}