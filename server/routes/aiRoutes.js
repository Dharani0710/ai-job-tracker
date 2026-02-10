const express = require("express");
const protect = require("../middleware/authMiddleware");
const { analyzeATS } = require("../controllers/aiController");

const router = express.Router();

router.post("/analyze", protect, analyzeATS);

module.exports = router;
