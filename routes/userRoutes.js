const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get('/',userController.loadHome)
router.get('/services',userController.loadService)

// router.use((req, res) => {
//   res.status(404).render("404");
// });

module.exports = router;