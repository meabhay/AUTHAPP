const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema (
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true, 
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["Admin", "Student", "Visitor"]
        },
        token: { 
            type: String
        }
    }
)

module.exports = mongoose.model("User", userSchema);