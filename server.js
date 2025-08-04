const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const app = express();
 
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
 

// User routes - set views path dynamically
app.use(
  "/",
  (req, res, next) => {
    app.set("views", path.join(__dirname, "views"));
    next();
  },
  userRoutes
);

app.listen(8800, () => {
  console.log("server running on port 8000");
});
