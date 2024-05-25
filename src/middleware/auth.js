const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    req.userId = decodedToken.id;

    next();
  } catch (error) {
    console.log("error", error);

    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
