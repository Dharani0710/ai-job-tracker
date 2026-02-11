const Job = require("../models/Job");

// CREATE JOB
exports.createJob = async (req, res) => {
  try {
    const { company, role, jobDescription } = req.body;

    if (!company || !role || !jobDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({
      company,
      role,
      jobDescription,
      userId: req.user.userId,  // ✅ FIXED
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET USER JOBS
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      userId: req.user.userId,   // ✅ FIXED
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.user.userId,  // ✅ FIXED
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.status = req.body.status || job.status;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,  // ✅ FIXED
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// SAVE ATS RESULT
exports.saveATSResult = async (req, res) => {
  try {
    const { atsScore, missingKeywords } = req.body;

    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.user.userId,  // ✅ FIXED
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.atsScore = atsScore;
    job.missingKeywords = missingKeywords;
    job.lastAnalyzedAt = new Date();

    await job.save();

    res.json({
      message: "ATS result saved to job",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save ATS result" });
  }
};
