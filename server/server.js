const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter =require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

// middlewareapp.use(
  app.use(
  cors({
    origin: "http://localhost:5173",   // for local dev
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);



// test route
app.get("/", (req, res) => {
  res.send("AI Job Tracker Backend Running 🚀");
});

// mongo connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
