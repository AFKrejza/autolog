//put the vehicle routes in here (crud list etc)

const express = require("express");
const router = express.Router();
const {newVehicleSchema, updateVehicleSchema, vehicleSchema} = require("../schemas");
const Ajv = require("ajv").default;
//const app = express;

//import dataManagementLayer exports
const dml = require("../data/dataManagementLayer");

//use paths from path module
const path = require("path");
//paths to different folders, starting with root (location of app.js)
const rootPath = path.dirname(require.main.filename);
const dataPath = path.join(rootPath, "data");
const vehicles = path.join(dataPath, "vehicles.json");

const ajv = new Ajv({ removeAdditional: "all" });

//see if ajv validation works:
//full route: http://localhost:3000/vehicles/create
//CREATE NEW VEHICLE
router.post("/create", async (req, res) => {
    
    //req.body shouldn't be altered, only validateBody
    const validatedBody = structuredClone(req.body);
    const valid = ajv.validate(newVehicleSchema, validatedBody); //removes additional properties from req.body here

    if (valid) {
        try {
            //TODO: add proper codes, e.g. missing year: correct code plus message and return the body
            //compare validatedBody to req.body using JSON.stringify()
            //this assumes the keys are in the same order (which they should be)
            if (JSON.stringify(validatedBody) != JSON.stringify(req.body)) { //if additional properties were added or removed
                await dml.createVehicle(validatedBody);
                res.status(203).send(validatedBody); //TODO: this should display a warning to the user. Figure out how this'll work on the frontend (show message and display vehicle where needed?).
            }
            else { //if nothing was changed
                await dml.createVehicle(validatedBody);
                res.status(201).send(validatedBody);
            }
            
            console.log("Vehicle created");
        }
        catch (error) {
            res.status(400).send("Error in vehicle creation: " + error);
            console.log("Error in vehicle creation");
        }
        
    }
    else {
        res.status(400).send("Error: " + ajv.errors.map(err => {
            const field = err.instancePath.replace("/", "") || "(root)"; //remove first / to get property path
            return `${field} ${err.message}`;
            //TODO: I think it only displays one error at a time. Probably not an issue?
        }));
        console.log("Error in vehicle creation");
    }
})

//list all vehicles
router.get("/list", async (req, res) => {
    const list = await dml.readVehicles();
    if (list == 0) {
        res.status(200).send([]); //kinda weird, but other code relies on readVehicles returning 0. Consider refactoring.
        return;
    }
    res.status(200).send(list);
})

//delete selected vehicle by ID
//get ID like in get, then delete that index
router.delete("/delete", async (req, res) => {
    //TODO: use this code everywhere! verify request body/params
    const id = parseInt(req.body.id, 10);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send({ error: "Invalid ID: Must be positive integer" });
    }

    const vehicle = await dml.deleteVehicle(id);
    if (vehicle == -1 || vehicle < 0) {
        res.status(404).send("Error 404: Vehicle not found");
        return;
    }
    res.status(200).send("Deleted vehicle"); //TODO: this doesn't verify the deletion. Does it need to?
})

//update vehicle by ID
//it'll send the updated vehicle with all the info
//get vehicle, then patch
router.patch("/update", async (req, res) => {

    const valid = ajv.validate(updateVehicleSchema, req.body); //only include make,model,year,id

    if (valid) {
        try{
            await dml.updateVehicle(req.body);
        }
        catch (error) {
            res.status(400).send("Error in vehicle updating: " + error);
            console.log("Error in vehicle updating: " + error);
            return;
        }
    }
    else if (!valid) {
        res.status(400).send("Error: " + ajv.errors.map(err => {
            const field = err.instancePath.replace("/", "") || "(root)";
            return `${field} ${err.message}`;
        }));
        console.log("Error in vehicle updating");
        return;
    }
    const returnVehicle = await dml.readVehicle(req.body.id);
    //console.log(returnVehicle);
    res.status(200).send(returnVehicle);
})

//get combined entries of selected Vehicles
router.get("/mult", async (req, res) => {
    //turn into array & validate & convert to int
    const vehicles = Object.values(req.body);
    const vehiclesLen = vehicles.length;
    if (vehicles.length <= 0) {
        res.status(400).send({ error: "400: No vehicles requested" });
        return;
    }
    for (let i = 0, j = vehiclesLen; i < j; i++) {
        let vId = parseInt(vehicles[i], 10);
        if (vId <= 0 || isNaN(vId)) {
            res.status(400).send({ error: "Error 400: Invalid vehicle ID: must be an integer > 0"})
            return;
        }
        vehicles[i] = vId; //replace
    }
    try {
        //verify that each vehicle exists
        for (let i = 0, j = vehiclesLen; i < j; i++) {
            const verify = await dml.vehicleCheck(vehicles[i]); //quite inefficient, new function using a Set object checking each vehicle only once would be faster
            if (verify == -1) {
                res.status(404).send("Error 404: Vehicle not found");
                return;
            }
        }
        const entries = await dml.readMultVehicleEntries(vehicles);
        res.status(200).send(entries);
    }
    catch (error) {
        res.status(400).send({ error });
    }
    //TODO: if id not found, error 400, for delete function too. 'this does not exist'.
})

//get vehicle by ID
// added async before (req,res) to use await inside the function
router.get("/:id", async (req, res) => {
    //req.params.id: TODO: make sure (validate) it's an int - check here or use ajv schema for id.
    try {
        const getVehicle = await dml.readVehicle(req.params.id);
        if (getVehicle == -1) {
            res.status(404).send("Error 404: Vehicle not found");
            return;
        }
        else {
            res.status(200).send(getVehicle);
            return;
        }
    }
    catch (error) {
        res.status(400).send("Error: " + error);
    }
    //console.log(getVehicle);
    //TODO: if id not found, error 400, for delete function too. 'this does not exist'.
})

//get ALL vehicle entries for ONE vehicle by ID
router.get("/:id/entries", async (req, res) => {
    let vId = parseInt(req.params.id, 10);
    if (vId <= 0 || isNaN(vId)) { //isNan: required because NaN always returns false when compared
        res.status(400).send({ error: "Error 400: Invalid vehicle ID: must be an integer > 0"})
        return;
    }
    try {
        const getVehicle = await dml.vehicleCheck(vId);
        if (getVehicle == -1) {
            res.status(404).send("Error 404: Vehicle not found");
            return;
        }
        else {
            const entries = await dml.readVehicleEntries(vId);
            res.status(200).send(entries);
        }
    }
    catch (error) {
        res.status(400).send("Error: " + error);
    }
    //TODO: if id not found, error 400, for delete function too. 'this does not exist'.
})

//get total vehicle spending for ONE vehicle by ID
//just adds .cost of all entries
router.get("/:id/entries/stats", async (req, res) => {
    let vId = parseInt(req.params.id, 10);
    if (vId <= 0 || isNaN(vId)) {
        res.status(400).send({ error: "Error 400: Invalid vehicle ID: must be an integer > 0" })
        return;
    }
    try {
        const getVehicle = await dml.vehicleCheck(vId);
        if (getVehicle == -1) {
            res.status(404).send({ error: "Error 404: Vehicle not found" });
            return;
        }
        const totalSpending = await dml.totalSpending(vId);
        res.status(200).send(totalSpending);
    }
    catch (error) {
        res.status(400).send("Error: " + error);
    }
    //TODO: if id not found, error 400, for delete function too. 'this does not exist'.
})

//exports the routes
module.exports = router;