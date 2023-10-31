require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const userRoutes = require("./app/routes/userRoutes");
const emailVericationRoutes = require("./app/routes/emailVerificationRoutes");

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});
app.use("/api", userRoutes);
app.use("/email-verification", emailVericationRoutes);

mongoose.connect("mongodb://localhost/maxloan-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
