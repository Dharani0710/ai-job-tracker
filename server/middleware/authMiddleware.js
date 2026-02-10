const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = null;

  // 1️⃣ Check Authorization header
  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      // token sent without Bearer
      token = req.headers.authorization;
    }
  }

  // 2️⃣ If still no token
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  // 3️⃣ Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = protect;
