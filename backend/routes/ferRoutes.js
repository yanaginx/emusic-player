const express = require("express");
const router = express.Router();
const { getEmotion } = require("../controllers/ferController");

router.get("/", getEmotion);

module.exports = router;
