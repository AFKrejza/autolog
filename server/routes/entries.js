//put the entry routes in here (crud list etc)

const express = require("express");
const router = express.Router();
const {vehicleSchema, entrySchema} = require("../schemas");
const Ajv = require("ajv").default
const app = express;

//TODO: see if i need a separate schemas folder.

//see if ajv validation works:
//full route: http://localhost:3000/entries/create
router.post("/create", (req, res) => {
    const ajv = new Ajv();
    
    console.log("Schema:", entrySchema);
    console.log("Request Body:", req.body);

    const valid = ajv.validate(entrySchema, req.body);

    if (valid) {
        //res.json(req.body)
        //call write function in data/dataManagementLayer.js
    }
    else {
        res.status(400).send(ajv.errors);
    }
})
//first validate, then check if id exists, otherwise return 400

//exports the routes for use elsewhere
module.exports = router;