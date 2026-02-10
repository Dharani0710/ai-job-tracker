const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { saveATSResult } = require("../controllers/jobController");

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", protect, getJobs);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);
router.put("/:id/ats", protect, saveATSResult);

module.exports = router;
