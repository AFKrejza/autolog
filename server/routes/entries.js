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
    
    const validatedBody = structuredClone(req.body);
    const valid = ajv.validate(newEntrySchema, validatedBody);

    if (valid) {
        try {
            //TODO: add proper codes, e.g. missing year: correct code plus message and return the body
            const entry = await dml.createEntry(validatedBody);
            if (entry == -1) {
                res.status(404).send("Error: Vehicle not found");
                return;
            }
            if (JSON.stringify(validatedBody) != JSON.stringify(req.body)) { //TODO: if they don't match: needs to display mismatch and what was removed (if anything!)
                res.status(203).send(validatedBody); //TODO: this should display a warning to the user. Figure out how this'll work on the frontend (add message and display entry where needed?).
                return;
            }
            else {
                res.status(201).send(validatedBody);
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
        }));
        console.log("Error in entry creation");
    }
})

//lists ALL entries
router.get("/list", async (req, res) => {
    const list = await dml.readEntries();
    if (list == 0) {
        res.status(200).send([]);
        return;
    }
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

//delete entry by ID
router.delete("/delete", async (req, res) => {
    const id = parseInt(req.body.id, 10);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send({ error: "Invalid ID: Must be positive integer" });
    }
    const entry = await dml.deleteEntry(id);
    if (entry == -1) {
        res.status(404).send("Error 404: Entry not found");
        return;
    }
    res.status(200).send("Deleted entry"); //TODO: this doesn't verify the deletion
    console.log("Deleted entry");
})

//first validate, then check if id exists, otherwise return 400

//exports the routes for use elsewhere
module.exports = router;