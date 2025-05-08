//read module express 
const express = require("express");
//initialization of a new Express.js server
const app = express();
//specification of the port on which the application should run on localhost 
const port = 5000;

//convert json data into js object
app.use(express.json());

//test
app.get("/test", (req, res) => {
  res.send('test!')
});

//setting the port on which the HTTP server should run  
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
});


//requests starting with /vehicles are handled by ./routes/vehicles
app.use("/vehicles", require("./routes/vehicles"));
app.use("/entries", require("./routes/entries"));