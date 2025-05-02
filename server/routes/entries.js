//put the entry routes in here (crud list etc)

const express = require("express");
const router = express.Router();
const {newEntrySchema, entrySchema} = require("../schemas");
const dml = require("../data/dataManagementLayer");
const Ajv = require("ajv").default;
//const app = express;
const ajv = new Ajv({ removeAdditional: "all" });
const path = require("path");
const rootPath = path.dirname(require.main.filename);
const dataPath = path.join(rootPath, "data");
const entries = path.join(dataPath, "entries.json");

//full route: http://localhost:3000/entries/create
router.post("/create", async (req, res) => {
    
    //TODO: add a log later

    const valid = ajv.validate(newEntrySchema, req.body);

    if (valid) {
        try {
            //TODO: add proper codes, e.g. missing year: correct code plus message and return the body
            const entry = await dml.createEntry(req.body);

            if (entry != req.body) { //if additional properties were removed
                res.status(203).send(req.body); //TODO: this should display a warning to the user. Figure out how this'll work on the frontend (show message and display entry where needed?).
            }
            else {
                res.status(201).send(req.body);
            }
            
            console.log("Entry created")
        }
        catch (error) {
            res.status(400).send("Error: " + ajv.errors.map(err => {
                const field = err.instancePath.replace("/", "") || "(root)";
                return `${field} ${err.message}`;
            }));
            console.log("Error in entry creation");
        }
        
    }
    else {
        res.status(400).send("Error: " + ajv.errors.map(err => {
            const field = err.instancePath.replace("/", "") || "(root)"; //remove first / to get property path
            return `${field} ${err.message}`;
            //only displays one error at a time
        }));
        console.log("Error in entry creation");
    }
})



//first validate, then check if id exists, otherwise return 400

//exports the routes for use elsewhere
module.exports = router;