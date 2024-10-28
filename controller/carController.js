const express = require("express");
const router = express.Router();
const personalDetails = require("../model/personal.js");
const cars = require("../model/car.js");

router.post("/create/:personId", async (req, res) => {
  try {
    const { make, model } = req.body;
    const { personId } = req.params;
    const findOnePerData = await personalDetails.findById(personId);
    if (!findOnePerData) {
      return res.json({
        message: "User not found",
        personId: personId,
      });
    }
    const newCar = new cars({
      make: make,
      model: model,
      personId: findOnePerData._id,
    });
    const savedCar = await newCar.save();
    findOnePerData.cars.push(savedCar._id);
    await findOnePerData.save();
    return res.json({
      message: "Successfully created car and personal detail .",
      vechicle: savedCar,
    });
  } catch (error) {
    console.error("Error creating personal detail and car:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getOneCar/:id", async (req, res) => {
  const { id } = req.params;
  const findOnePerData = await cars.findById(id);
  if (findOnePerData) {
    res.json({ message: "Successfully Working...", data: findOnePerData });
  } else {
    res.json({ message: "no user found in this : " + id });
  }
});

router.get("/getOneCarWithPer/:id", async (req, res) => {
  const { id } = req.params;
  const findOnePerData = await cars.findById(id).populate("personId");
  if (findOnePerData) {
    res.json({ message: "Successfully Working...", data: findOnePerData });
  } else {
    res.json({ message: "no user found in this : " + id });
  }
});

router.get("/getAllCarsWithPer", async (req, res) => {
  try {
    const findAllCarsData = await cars.find().populate("personId");
    if (findAllCarsData && findAllCarsData.length > 0) {
      res.json({
        message: "Successfully Working...",
        data: findAllCarsData,
      });
    } else {
      res.json({ message: "No cars found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

router.delete("/deleteOnlyCar/:personId", async (req, res) => {
  try {
    const findOnePerData = await cars.findById(req.params.personId);
    if (!findOnePerData) {
      return res.json({
        message: "Car not found...",
      });
    }
    await cars.findByIdAndDelete(req.params.personId);
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


