//Node.js File system module
const fs = require("fs");

//use paths from path module
const path = require("path");
//paths to different folders, starting with root (location of app.js)
const rootPath = path.dirname(require.main.filename);
const dataPath = path.join(rootPath, "data");
const vehicles = path.join(dataPath, "vehicles.json");

//in uu github, stringify and utf-8 encoding is used. check why.
//async makes it return a promise
//use try and catch
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
    //console.log(data.id); debug

    allVehicles.push(data);

    await fs.promises.writeFile('./data/vehicles.json', JSON.stringify(allVehicles), {encoding: "utf-8"});
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
    const allVehicle = await fs.promises.readFile(vehicles); //clean this up
    const allVehicles = JSON.parse(allVehicle);

    //find index of ID vehicle, return vehicle at index
    const vehicleIndex = allVehicles.findIndex(vehicle => vehicle.id === ID);
    const returnVehicle = allVehicles[vehicleIndex];
    return returnVehicle; //this returns a copy?
}

//delete vehicle by finding ID, then delete that index
//TODO: very similar to readVehicle function, make a new function
//import, then delete the element, then write the whole thing to vehicles.json again
async function deleteVehicle (ID) {
    const allVehicle = await fs.promises.readFile(vehicles); //clean this up
    const allVehicles = JSON.parse(allVehicle);

    //find index of ID vehicle, return vehicle at index
    const vehicleIndex = allVehicles.findIndex(vehicle => vehicle.id === ID);
    console.log("vehicleIndex: " + vehicleIndex);
    allVehicles.splice(vehicleIndex, 1); //1 specifies to only delete one vehicle.

    await fs.promises.writeFile('./data/vehicles.json', JSON.stringify(allVehicles), {encoding: "utf-8"});
    //console.log("deleted vehicle");
    //return returnVehicle; //this returns a copy?
}

module.exports.createVehicle = createVehicle;
module.exports.readVehicles = readVehicles;
module.exports.readVehicle = readVehicle;
module.exports.deleteVehicle = deleteVehicle;