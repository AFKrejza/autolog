//put the entry routes in here (crud list etc)

const express = require("express");
const router = express.Router();
const {entrySchema, newEntrySchema, updateEntrySchema} = require("../schemas");
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
            if (entry == -1) {
                res.status(404).send("Error: Vehicle not found");
                return;
            }
            if (entry == -2) {
                res.status(500).send("Error 500: Database empty or inaccessible");
                return;
            }

            if (entry != req.body) { //TODO: if they don't match: needs to display mismatch and what was removed (if anything!)
                res.status(203).send(req.body); //TODO: this should display a warning to the user. Figure out how this'll work on the frontend (add message and display entry where needed?).
                return;
            }
            else {
                res.status(201).send(req.body);
                console.log("Entry created");
                return;
            }
        }
        catch (error) {
            console.log("Error in entry creation: " + error);
            res.status(400).send("Error in entry creation: " + error);
            return;
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

//lists ALL entries
router.get("/list", async (req, res) => {
    const list = await dml.readEntries();
    res.status(200).send(list);
})

//update entry by ID
router.patch("/update", async (req, res) => {

    const valid = ajv.validate(updateEntrySchema, req.body); //createdAt & updatedAt fields ignored

    if (valid) {
        try{
            const check = await dml.updateEntry(req.body);
            if (check == -1) {
                res.status(500).send("Error 500: Database empty or inaccessible");
                return;
            }
            if (check == -2) {
                res.status(403).send("Error 403: Wrong vehicleId");
            }
        }
        catch (error) {
            res.status(400).send("Error in entry updating: " + error);
            console.log("Error in entry updating: " + error);
            return;
        }
    }
    else if (!valid) {
        res.status(400).send("Error: " + ajv.errors.map(err => {
            const field = err.instancePath.replace("/", "") || "(root)";
            return `${field} ${err.message}`;
        }));
        console.error("Error in entry updating");
        return;
    }
    //Reads it from the list to get all the data
    const returnEntry = await dml.readEntry(req.body.id);
    if (returnEntry == -1) {
        res.status(404).send({ error: "Error 404: Entry not found" });
        console.error("Error 404: Entry not found");
        return;
    }
    else if(returnEntry == -2) {
        res.status(500).send({ error: "Error 500: Database empty or inaccessible"});
        return;
    }
    res.status(200).send(returnEntry);
})

//first validate, then check if id exists, otherwise return 400

//exports the routes for use elsewhere
module.exports = router;