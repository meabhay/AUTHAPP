const express = require("express");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

const user = require("./routes/user.js")
app.use("/api/v1", user);

const connectDB = require("./config/database.js");
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})

