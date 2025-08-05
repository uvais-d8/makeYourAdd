const mongoose = require("mongoose");

const connectDb = async () => {
  try {
   await mongoose.connect("mongodb://127.0.0.1:27017/MakeYourAdd");
    console.log('mongoodb connected')
  } catch (error) {
    console.log("error", error);
  }
};

module.exports=connectDb