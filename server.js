//imports including env variables.
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

//port for server in env variable or just to 3500
const PORT = process.env.PORT || 3500;

//connect to MongooseDB
connectDB();

//Cross uses for resource sharning
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//default for all paths static
app.use("/", express.static(path.join(__dirname, "/public")));

//add routes
app.use("/", require("./routes/root"));
app.use("/states", require("./routes/api/states"));

//add catch all for routes
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("text/html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Fond" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

//verify server was Database was connected
mongoose.connection.once("open", () => {
  console.log("Connect to db");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
