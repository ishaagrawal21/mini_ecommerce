const { default: mongoose } = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect("mongodb://127.0.0.1:27017/Blogweb");
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
