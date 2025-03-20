const express = require("express");
const router = express.Router();

const { login, signup } = require("../controllers/Auth.js");
const { auth, isStudent, isAdmin } = require("../middleware/auth.js");


router.post("/login", login);
router.post("/signup", signup);

//proctect routes

router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        status: true,
        message: "Welcome to the protected route for Student"
    })
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        status: true,
        message: "Welcome to the protected route for Admin"
    })
})

module.exports = router;