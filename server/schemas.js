// Server Side JS - Express.js - Validation - Using Ajv for schemas

const Ajv = require("ajv").default;

//vehicle creation schema
//contains: make, model, year, maybe notes?
const vehicleSchema = {
    type: "object",
    properties: {
        make: {type: "string"},
        model: {type: "string"},
        year: {type: "number"}
    },
    required: ["make", "model", "year"]
}




//entry creation schema
//contains: date, description, cost, mileage, mechanic, category, notes
//TODO: date is just a number, fix this.
const entrySchema = {
    type: "object",
    properties: {
        date: {type: "number"},
        description: {type: "string"},
        cost: {type: "number"},
        mileage: {type: "number"},
        mechanic: {type: "string"},
        category: {type: "string"},
        notes: {type: "string"},
    },
    required: ["date", "description", "cost", "mileage", "mechanic", "category", "notes"]
}

//export schemas
module.exports = {
    vehicleSchema,
    entrySchema
};

//TODO: fix see if I can convert the date, or if this is a frontend thing, or figure out how it's meant to work. FOR NOW: take input as DDMMYYYY ??
//TODO: see if an id property should be added here (don't think so since this validates user input)

