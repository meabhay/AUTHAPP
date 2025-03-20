const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("MongoDB connected successfully :) ");
    } catch (error) {
        console.log("MongoDB connection unsuccessfull !");
        process.exit(1);
    }
}
module.exports = connectDB;