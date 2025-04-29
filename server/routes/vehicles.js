//put the vehicle routes in here (crud list etc)

const express = require("express");
const router = express.Router();
const {vehicleSchema, entrySchema} = require("../schemas");
const Ajv = require("ajv").default
const app = express;

//import dataManagementLayer exports
const dml = require("../data/dataManagementLayer");

//use paths from path module
const path = require("path");
//paths to different folders, starting with root (location of app.js)
const rootPath = path.dirname(require.main.filename);
const dataPath = path.join(rootPath, "data");
const vehicles = path.join(dataPath, "vehicles.json");

//see if ajv validation works:
//full route: http://localhost:3000/vehicles/create
//CREATE NEW VEHICLE
router.post("/create", (req, res) => {
    const ajv = new Ajv();
    
    //debug, leave this here for now
    //console.log("Schema:", vehicleSchema);
    //console.log("Request Body:", req.body);
    //TODO: add a log later

    const valid = ajv.validate(vehicleSchema, req.body);

    if (valid) {
        //res.json(req.body)
        //call create function in data/dataManagementLayer.js
        //TODO: This doesn't check if the code ran CORRECTLY, it only says "function called successfully". use try and catch.
        //TODO: add proper codes, e.g. missing year: correct code plus message
        dml.createVehicle(req.body);
        res.status(201).send("Vehicle created");
    }
    else {
        res.status(400).send(ajv.errors);
    }
})

//exports the routes
module.exports = router;