const express = require("express");
const router = express.Router();
const User = require("../models/user.js")

const { login, signup } = require("../controllers/Auth.js");
const { auth, isStudent, isAdmin } = require("../middleware/auth.js");


router.post("/login", login);
router.post("/signup", signup);


//proctected routes

router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        status: true,
        message: "Welcome to the protected route for Student"
    })
})

router.get("/Tests", auth, (req, res) => {
  res.json({
    status: true,
    message: "Welcome to the protected route for Tests",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        status: true,
        message: "Welcome to the protected route for Admin"
    })
})


router.get("/getInfo", auth, async (req, res) => {

    const id = req.user.id;
    console.log("ID", id);

    const user = await User.findById(id);

    res.json({
        status: true,
        user: user,
        message: "Welcome to the protected route for getInfo"
    })
})


module.exports = router;