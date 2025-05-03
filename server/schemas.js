// Server Side JS - Express.js - Validation - Using Ajv for schemas

//const Ajv = require("ajv").default;

//vehicle creation schema
//contains: make, model, year, maybe notes?
const newVehicleSchema = {
    type: "object",
    properties: {
        make: {type: "string"},
        model: {type: "string"},
        year: {type: "integer", exclusiveMinimum: 0}
    },
    required: ["make", "model", "year"]
}

const vehicleSchema = {
    type: "object",
    properties: {
        make: {type: "string"},
        model: {type: "string"},
        year: {type: "integer", exclusiveMinimum: 0},
        id: {type: "integer", exclusiveMinimum: 0},
        createdAt: {type: "string"},
        updatedAt: {type: "string"}
    },
    required: ["make", "model", "year", "id", "createdAt", "updatedAt"]
}

const updateVehicleSchema = {
    type: "object",
    properties: {
        make: {type: "string"},
        model: {type: "string"},
        year: {type: "integer", exclusiveMinimum: 0},
        id: {type: "integer", exclusiveMinimum: 0},
        
    },
    required: ["make", "model", "year", "id"]
}



//entry creation schema
//contains: date, description, cost, mileage, mechanic, category, notes
//TODO: date is just a number, fix this.
const entrySchema = {
    type: "object",
    properties: {
        vehicleId: {type: "integer", exclusiveMinimum: 0},
        date: {type: "string"},
        description: {type: "string"},
        cost: {type: "integer", exclusiveMinimum: -1},
        mileage: {type: "number", exclusiveMinimum: -1},
        mechanic: {type: "string"},
        category: {type: "string"},
        notes: {type: "string"},
        id: {type: "integer"},
        createdAt: {type: "string"},
        updatedAt:{type: "string"}
    },
    required: ["vehicleId", "date", "description", "cost", "mileage", "mechanic", "category", "notes", "id", "createdAt", "updatedAt"]
}

const newEntrySchema = {
    type: "object",
    properties: {
        vehicleId: {type: "integer", exclusiveMinimum: 0},
        date: {type: "string"},
        description: {type: "string"},
        cost: {type: "integer", exclusiveMinimum: 0},
        mileage: {type: "number", exclusiveMinimum: -1},
        mechanic: {type: "string"},
        category: {type: "string"},
        notes: {type: "string"},
    },
    required: ["vehicleId", "date", "description", "cost", "mileage", "mechanic", "category", "notes"]
}

const updateEntrySchema = {
    type: "object",
    properties: {
        vehicleId: {type: "integer", exclusiveMinimum: 0},
        date: {type: "string"},
        description: {type: "string"},
        cost: {type: "integer", exclusiveMinimum: -1},
        mileage: {type: "number", exclusiveMinimum: -1},
        mechanic: {type: "string"},
        category: {type: "string"},
        notes: {type: "string"},
        id: {type: "integer"},
    },
    required: ["vehicleId", "date", "description", "cost", "mileage", "mechanic", "category", "notes", "id"]
}


//export schemas
module.exports = { //TODO: may need to be export default instead
    newVehicleSchema,
    updateVehicleSchema,
    vehicleSchema,
    newEntrySchema,
    entrySchema,
    updateEntrySchema
};

//TODO: fix see if I can convert the date, or if this is a frontend thing, or figure out how it's meant to work. FOR NOW: take input as DDMMYYYY ??
//TODO: see if an id property should be added here (don't think so since this validates user input)

