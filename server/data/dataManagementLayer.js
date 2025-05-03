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
    //console.log(data.id); debug

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

//TODO: just use the readVehicles function
async function readVehicle (ID) {
    const allVehicles = await readVehicles();

    //find index of ID vehicle, return vehicle at index
    const vehicleIndex = allVehicles.findIndex(vehicle => vehicle.id === ID);
    const returnVehicle = allVehicles[vehicleIndex];
    return await returnVehicle; //this returns a copy?
}

//delete vehicle by finding ID, then delete that index
//TODO: very similar to readVehicle function, make a new function
//import, then delete the element, then write the whole thing to vehicles.json again
async function deleteVehicle (ID) {
    const allVehicles = await readVehicles();

    //find index of ID vehicle, return vehicle at index
    const vehicleIndex = allVehicles.findIndex(vehicle => vehicle.id === ID);
    console.log("vehicleIndex: " + vehicleIndex);
    allVehicles.splice(vehicleIndex, 1); //1 specifies to only delete one vehicle.

    await writeVehicles(allVehicles);
    //console.log("deleted vehicle");
    //return returnVehicle; //this returns a copy?
}

//update vehicle
//it'll send the updated vehicle with all the info
async function updateVehicle (updated) {
    console.log("debug");
    const allVehicles = await readVehicles();
    
    //check if vehicle exists by finding vehicle.id
    const vehicleIndex = allVehicles.findIndex(vehicle => vehicle.id === updated.id); //TODO: does this need an await?
    //if it was found. then replace.
    //TODO: add ajv to check that the ID is greater than 0
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

async function readEntries () {
    const allEntries = await fs.promises.readFile(entries);
    //if it's empty, it will crash when trying to parse it
    if (allEntries.length == 0) {
        return 0;
    }
    return await JSON.parse(allEntries);
}

//write to vehicles
async function writeEntries(allEntries) {
    await fs.promises.writeFile('./data/entries.json', JSON.stringify(allentries), {encoding: "utf-8"});
}




//import vehicle list, check if data.vehicleId matches a vehicle
//then create new entry, add vehicleId to it
//assign it an id
//TODO: decide how to sort them: by date
async function createEntry (data) {
    const allVehicles = await readVehicles();
    
    //add ID to each entry, go through all existing ones, start at id 1
    let id = 1;
    const list = await readVehicles();
    if (oldList != 0) {
        allVehicles.push(...oldList);
        id = newID(allVehicles);
    }
    
    data.id = id;
    //console.log(data.id); debug

    allVehicles.push(data);

    await writeVehicles(allVehicles);
}

module.exports.createVehicle = createVehicle;
module.exports.deleteVehicle = deleteVehicle;
module.exports.readVehicles = readVehicles;
module.exports.readVehicle = readVehicle;
module.exports.updateVehicle = updateVehicle;

module.exports.createEntry = createEntry;
//module.exports.deleteEntry = deleteEntry;
module.exports.readEntries = readEntries;
//module.exports.readEntry = readEntry;
//module.exports.updateEntry = updateEntry;