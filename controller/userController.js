const path = require("path");

const loadHome = async (req, res) => {
  try {
    console.log('loading home')
    res.render("home");
    
  } catch (error) {
    console.log("error while load home");
  }
};
const loadService = async (req, res) => {
  try {
    res.render('services')
  } catch (error) {
    console.log("error : ", error);
  }
};

module.exports = {
  loadService,
  loadHome
};
