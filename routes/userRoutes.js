const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const User = require('../model/userModel');
router.post('/AddUser', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
  });
  await user.save();
  res.send("User saved");
});


// GET Signup Page
router.post("/signupUser",userController.createUser)
router.get("/signup",userController.loadSignUp)

router.get('/login',userController.loadLogin)
router.post('/loginUser',userController.loginUser)


router.get('/',userController.loadHome)
router.get('/services',userController.loadService)

router.post("/sendEmail",userController.sendEmail)
 

module.exports = router;