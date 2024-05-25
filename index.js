const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRoutes = require("./src/Routers/index");
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", apiRoutes);

// app.use("/", (req, res) => {
//   res.send("The backend is running very fine.");
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect("mongodb://127.0.0.1:27017/Task", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () =>
  console.log("Connection successful !! ")
);
