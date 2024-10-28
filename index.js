const express = require("express");
const mongoose = require("mongoose");
// const bodyparser = require("body-parser");
const personal = require("../newProject/controller/personalController.js");
const car = require("../newProject/controller/carController.js");
const app = express();
const router = express.Router();
mongoose.set("strictPopulate", false);
const url = "mongodb://127.0.0.1:27017/onetomanyDB";
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;
con.once("open", () => {
  console.log("connection.");
})

app.use(express.json());
// app.use(bodyparser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(personal);
app.use(car);
app.use(router);
router.get("/test", (req, res) => {
  res.json({ message: "Successfully Working..." });
});

const port = 6000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


