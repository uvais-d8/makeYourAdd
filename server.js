const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const connectDB=require('./db')
const cors = require("cors");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // for JSON form data

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Views
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.use("/", userRoutes);

// Start server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
