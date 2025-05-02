//put the vehicle routes in here (crud list etc)

const express = require("express");
const router = express.Router();
const {newVehicleSchema, vehicleSchema} = require("../schemas");
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
    
    //TODO: add a log later

    const valid = ajv.validate(newVehicleSchema, req.body);

    if (valid) {
        try {
            //call create function in data/dataManagementLayer.js
            //TODO: This doesn't check if the code ran CORRECTLY, it only says "function called successfully". use try and catch.
            //TODO: add proper codes, e.g. missing year: correct code plus message and return the body
            const vehicle = await dml.createVehicle(req.body);

            if (vehicle != req.body) { //if additional properties were removed
                res.status(203).send(req.body); //TODO: this should display a warning to the user. Figure out how this'll work on the frontend (show message and display vehicle where needed?).
            }
            else {
                res.status(201).send(req.body);
            }
            
            console.log("Vehicle created")
        }
        catch (error) {
            res.status(400).send("Error: " + ajv.errors.map(err => {
                const field = err.instancePath.replace("/", "") || "(root)";
                return `${field} ${err.message}`;
            }));
            console.log("Error in vehicle creation");
        }
        
    }
    else {
        res.status(400).send("Error: " + ajv.errors.map(err => {
            const field = err.instancePath.replace("/", "") || "(root)"; //remove first / to get property path
            return `${field} ${err.message}`;
            //only displays one error at a time
        }));
        console.log("Error in vehicle creation");
    }
})

//get vehicle by ID
// added async before (req,res) to use await inside the function
router.get("/get", async (req, res) => {
    //req.body.id = id value. TODO: make sure (validate) it's an int - check here or use ajv schema for id.
    const getVehicle = await dml.readVehicle(req.body.id);
    console.log(getVehicle);
    res.status(200).send(getVehicle);
    //TODO: if id not found, error 400, for delete function too. 'this does not exist'.
})

//list all vehicles
router.get("/list", async (req, res) => {
    const list = await dml.readVehicles();
    res.status(200).send(list);
})

//delete selected vehicle by ID
//get ID like in get, then delete that index
router.delete("/delete", async (req, res) => {
    const vehicle = await dml.deleteVehicle(req.body.id);
    res.status(200).send("deleted vehicle"); //TODO: this doesn't verify the deletion
})

//update vehicle by ID
//it'll send the updated vehicle with all the info
//get vehicle, then patch
router.patch("/update", async (req, res) => {

    const valid = ajv.validate(vehicleSchema, req.body);

    if (valid) {
        await dml.updateVehicle(req.body);
    }
    res.status(200).send(req.body);
})

//exports the routes
module.exports = router;