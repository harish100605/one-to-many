const express = require("express");
const router = express.Router();
const personalDetails = require("../model/personal.js");
const cars = require("../model/car.js");

router.post("/create", async (req, res) => {
    try {
      const { name, age, make, model } = req.body;
      const newPerson = new personalDetails({
        name: name,
        age: age,
      });
      const savedPerson = await newPerson.save();
      const newCar = new cars({
        make: make,
        model: model,
        personId: savedPerson._id,
      });
      const savedCar = await newCar.save();
      savedPerson.cars.push(savedCar._id);
      await savedPerson.save();
      res.json({
        message: "Successfully created personal detail and car.",
        person: savedPerson,
        car: savedCar,
      });
    } catch (error) {
      console.error("Error creating personal detail and car:", error);
      res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/getOnePerson/:id", async (req, res) => {
  const { id } = req.params;
  const findOnePerData = await personalDetails.findById(id);
  if (findOnePerData) {
    res.json({ message: "Successfully Working...", data: findOnePerData });
  } else {
    res.json({ message: "no user found in this : " + id });
  }
});

router.get("/getAllPerWithCar", async (req, res) => {
    const { id } = req.params;
    const findOnePerData = await personalDetails.find().populate("cars");
    if (findOnePerData) {
      res.json({ message: "Successfully Working...", data: findOnePerData });
    } else {
      res.json({ message: "no user found in this : " + id });
    }
});

router.delete("/deletePersonWithCar/:personId", async (req, res) => {
    try {
      const findOnePerData = await personalDetails.findById(
        req.params.personId
      );
      if (!findOnePerData) {
        return res.json({
          message: "personalDetails not found...",
        });
      }
      await personalDetails.findByIdAndDelete(req.params.personId).populate("cars");
      return res.json({
        message: "Successfully deleted...",
      });
    } catch (err) {
      return res.json({
        message: "try again later",
      });
    }
});

module.exports = router;


// let UserController = {
//     find: async (req,res) => {
//         let found = await UserModel.find({name: req.params.username});
//         res.json(found);
//     },
//     all: async (req,res) => {
//         let allUsers = await UserModel.find();
//         res.json(allUsers);
//     },
//     getAllCars: async (req,res) => {
//         let foundUser = await UserModel.find({name: req.params.username}).populate("cars");
//         res.json(foundUser);
//     }
// }
