const express = require("express");
const multer = require("multer");
// AWS S3 v3 config
const crypto = require("crypto");
const path = require("path");
const { promisify } = require("util");
const MobileBanner = require("../models/mobileBanner");

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const banners = await MobileBanner.find();
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



module.exports = router;
