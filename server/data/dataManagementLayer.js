//Node.js File system module
const fs = require("fs");

//use paths from path module
const path = require("path");
//paths to different folders, starting with root (location of app.js)
const rootPath = path.dirname(require.main.filename);
const dataPath = path.join(rootPath, "data");
const vehicles = path.join(dataPath, "vehicles.json");
const entries = path.join(dataPath, "entries.json");

//shared functions

//returns today's date in YYYY-MM-DD
function dateNow() {
    const date = new Date().toJSON().slice(0,10);
    return date;
}

//TODO: put newID here and let vehicles and entries use it

//it needs to import vehicles.json via readfile, THEN add data, THEN writefile
async function createVehicle (data) {
    const allVehicles = [];

    
    //add ID to each vehicle, go through all existing ones, start at id 1
    let id = 1;
    const oldList = await readVehicles();
    if (oldList != 0) {
        allVehicles.push(...oldList);
        id = newID(allVehicles);
    }
    
    data.id = id;
    data.createdAt = dateNow();
    data.updatedAt = dateNow();

    allVehicles.push(data);
    //let now = dateNow();
    //console.log(now);
    await writeVehicles(allVehicles);
}

//read ALL vehicles
async function readVehicles () {
    const allVehicles = await fs.promises.readFile(vehicles);
    //if it's empty, it will crash when trying to parse it
    if (allVehicles.length == 0) {
        return 0;
    }
    return await JSON.parse(allVehicles);
}

//write to vehicles
async function writeVehicles(allVehicles) {
    await fs.promises.writeFile('./data/vehicles.json', JSON.stringify(allVehicles), {encoding: "utf-8"});
}

function newID (allVehicles) {
    let id = 0;
    allVehicles.forEach(vehicle => {
        if (vehicle.id > id) {
            id = vehicle.id;
        }
    })
    return id += 1;
    //works fine, prevents duplicate and <1 ids. always selects next highest id.
}

//consider modifying readVehicles to just read each vehicle by ID
//function reads vehicle by requested ID and returns the whole vehicle object
async function readVehicle (ID) {
    const allVehicles = await readVehicles();

    //find index of ID vehicle, return vehicle at index
    const vehicleIndex = allVehicles.findIndex(vehicle => vehicle.id == ID);
    if (vehicleIndex >= 0) {
        const returnVehicle = allVehicles[vehicleIndex];
        return returnVehicle; //this returns a copy?
    }
    else {
        return -1;
    }
}

//delete vehicle by finding ID, then delete that index
//TODO: very similar to readVehicle function, make a new function
//import, then delete the element, then write the whole thing to vehicles.json again
async function deleteVehicle (ID) {
    const allVehicles = await readVehicles();

    //find index of ID vehicle, return vehicle at index
    const vehicleIndex = allVehicles.findIndex(vehicle => vehicle.id === ID);
    if (vehicleIndex == -1 || vehicleIndex < 0) return -1;
    allVehicles.splice(vehicleIndex, 1); //1 specifies to only delete one vehicle.
    await deleteVehicleEntries(ID);
    await writeVehicles(allVehicles);
    //console.log("deleted vehicle");
}

//update vehicle
//it'll send the updated vehicle with all the info
async function updateVehicle (updated) {
    const allVehicles = await readVehicles();
    
    //check if vehicle exists by finding vehicle.id
    const vehicleIndex = allVehicles.findIndex(vehicle => vehicle.id === updated.id); //TODO: does this need an await?
    //if it was found. then replace.
    if (vehicleIndex >= 0) {
        allVehicles[vehicleIndex].make = updated.make;
        allVehicles[vehicleIndex].model = updated.model;
        allVehicles[vehicleIndex].year = updated.year;
        allVehicles[vehicleIndex].updatedAt = dateNow();
    }
    await writeVehicles(allVehicles);
    console.log("Updated vehicle");
}





//ENTRIES

//sort entries - call this whenever an entry is created, updated, or deleted, or when a vehicle is deleted
//ascending order
async function sortEntries() {
    let allEntries = await readEntries();
    if (allEntries == -1) {
        return -1;
    }
    //convert to Date objects
    await allEntries.sort((a, b) => new Date(b.date) - new Date(a.date)); //- before, + after

    await writeEntries(allEntries);
}

//returns ALL entries in the database
async function readEntries () {
    const allEntries = await fs.promises.readFile(entries);
    //if it's empty, it will crash when trying to parse it
    if (allEntries.length == 0) {
        return 0; //don't try changing this again.
    }
    return await JSON.parse(allEntries);
}

//write to entries.json
async function writeEntries(allEntries) {
    await fs.promises.writeFile('./data/entries.json', JSON.stringify(allEntries), {encoding: "utf-8"});
}

//check if vehicle exists and return index of vehicle!
async function vehicleCheck(vId) {
    const allVehicles = await readVehicles();
    for (let i = 0, j = allVehicles.length; i < j; i++) {
        if (allVehicles[i].id == vId) {
            return i;
        }
    }
    return -1; //if not found
}

//function reads entry by requested ID and returns the whole entry object
//Only returns ONE entry
async function readEntry (ID) {
    const allEntries = await readEntries();
    if (allEntries == 0) {
        return -2;
    }

    //find index of ID entry, return entry at index
    const entryIndex = allEntries.findIndex(entry => entry.id == ID);
    if (entryIndex >= 0) {
        const returnEntry = allEntries[entryIndex];
        return returnEntry; //this returns a copy?
    }
    else {
        return -1;
    }
}


//import vehicle list, check if data.vehicleId matches a vehicle
//then create new entry, add vehicleId to it
//assign it an id
//TODO: decide how to sort them: by date
async function createEntry (entry) {
    const allEntries = [];
    //add ID to each entry, go through all existing ones, start at id 1
    const vehicleIndex = await vehicleCheck(entry.vehicleId);
    if (vehicleIndex == -1 || vehicleIndex < 0) {
        return -1;
    }
    let id = 1;
    const list = await readEntries();
    if (list != 0) {
        allEntries.push(...list);
    }
    id = newID(allEntries);
    entry.id = id;
    entry.createdAt = dateNow();
    entry.updatedAt = dateNow();
    allEntries.push(entry);
    await writeEntries(allEntries);
    await sortEntries();
    //update vehicle updatedAt to current date, find index of vehicle
    const allVehicles = await readVehicles();
    //const vehicleIndex = allVehicles.findIndex(vehicle => vehicle.id === entry.vehicleId);
    allVehicles[vehicleIndex].updatedAt = dateNow(); //TODO: fix bug here
    await writeVehicles(allVehicles);
    return vehicleIndex;
}

//update entry, sends the updated vehicle with all the info
async function updateEntry (updated) {
    const allEntries = await readEntries();
    if (allEntries == 0) return -1;
    //check vehicleId
    const vehicleIndex = await vehicleCheck(updated.vehicleId);
    if (vehicleIndex == -1 || vehicleIndex < 0) {
        return -2;
    }
    
    //check if entry exists by finding entry.id
    const entryIndex = allEntries.findIndex(entry => entry.id == updated.id && entry.vehicleId == updated.vehicleId); //TODO: does this need an await?
    //if the entry was found: replace.
    if (entryIndex >= 0) {
        allEntries[entryIndex].date = updated.date;
        allEntries[entryIndex].description = updated.description;
        allEntries[entryIndex].cost = updated.cost;
        allEntries[entryIndex].mileage = updated.mileage;
        allEntries[entryIndex].mechanic = updated.mechanic;
        allEntries[entryIndex].category = updated.category;
        allEntries[entryIndex].notes = updated.notes;
        allEntries[entryIndex].updatedAt = dateNow();
    }
    await writeEntries(allEntries);
    await sortEntries();
    console.log("Updated entry");
}

//delete ONE entry by ID
async function deleteEntry (ID) {
    const allEntries = await readEntries();

    //find index of ID, return entry at index
    const entryIndex = allEntries.findIndex(entry => entry.id === ID);
    if (entryIndex == -1) return -1;
    allEntries.splice(entryIndex, 1); //1 specifies to only delete one entry.
    await writeEntries(allEntries);
    await sortEntries();
    //works, but is inefficient as it deletes, writes, reads, sorts, writes instead of deletes, sorts, writes
}

//returns ALL entries belonging to a vehicle
//TODO: use this function for calculating spending
async function readVehicleEntries (ID) {
    const list = await readEntries();
    const vehicleEntries = [];
    if (list == 0) return -1;
    for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].vehicleId == ID) {
            vehicleEntries.push(list[i]);
        }
    }
    if (vehicleEntries.length > 0) {
        return vehicleEntries;
    }
    else return -2;
}
//TODO: figure out how to only send X entries at a time (to display ONLY e.g. 10, 20, 50, 100 entries), use new function since this sends ALL
//or rewrite it to take an argument

//delete ALL entries belonging to a vehicle
async function deleteVehicleEntries (ID) {
    const list = await readEntries();
    let counter = 0;
    if (list == 0) return -1;
    for (let i = list.length - 1; i >= 0; i--) { //delete from last element, otherwise errors and skips happen
        if (list[i].vehicleId == ID) {
            list.splice(i, 1);
            counter++;
        }
    }
    if (counter > 0) {
        console.log("deleted " + counter + " entries");
        await writeEntries(list);
        await sortEntries(); //inefficient, but works.
    }
    else return -2;
}

//takes an array with the vehicle IDs
//consider using Set object for O(1) lookup instead of O(n) for sets
async function readMultVehicleEntries (vehicles) {
    //add to Set (also handles duplicate vehicle IDs)
    const vIds = new Set(vehicles);
    const list = await readEntries();
    const vehicleEntries = [];
    if (list == 0) return vehicleEntries;

    for (let i = 0, j = list.length; i < j; i++) {
        if (vIds.has(list[i].vehicleId)) { //should be much faster than array iteration
            vehicleEntries.push(list[i]);
        }
    }
    return vehicleEntries; //regardless of if it's empty
}

module.exports.createVehicle = createVehicle;
module.exports.deleteVehicle = deleteVehicle;
module.exports.readVehicles = readVehicles;
module.exports.readVehicle = readVehicle;
module.exports.updateVehicle = updateVehicle;
module.exports.readVehicleEntries = readVehicleEntries;
module.exports.deleteVehicleEntries = deleteVehicleEntries;
module.exports.vehicleCheck = vehicleCheck;
module.exports.readMultVehicleEntries = readMultVehicleEntries

module.exports.createEntry = createEntry;
module.exports.deleteEntry = deleteEntry;
module.exports.readEntries = readEntries;
module.exports.readEntry = readEntry;
module.exports.updateEntry = updateEntry;