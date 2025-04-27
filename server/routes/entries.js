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
        res.json(req.body)
    }
    else {
        res.status(400).send(ajv.errors);
    }
})

//exports the routes
module.exports = router;