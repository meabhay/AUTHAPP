const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//Sign up handler
exports.signup = async (req, res) => {
    try {
        //get data
        const {name, email, password, role} = req.body;
        //check if user exist already 
        const existingUser = await User.findOne({email});
        //if exist then return message already exist
        if(existingUser){
            return res.status(400).json({
                sucess: false,
                message: 'User exist already',
            })
        }

        //secure password
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
              success: false,
              message: "Error in hashing Password",
            });
        }

        //create entry for user
        const user = await User.create({
            name, email, password: hashedPassword, role,
        }) 

        return res.status(200).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({
            success: false,  

            message: "User cannot be registered , Please try again later",
        })
    }
};


//Login Handler
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //validation of email nd password
        if(!email || !password){
            return res.status(404).json({
                status: false,
                message: "Please enter email and password both",
            })
        }

        let user =  await User.findOne({email});
        //if not a registered user
        if(!user){
            return res.status(402).json({
                status: true,
                message: "User is not registered",
            }) 
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        }
        // Verify password and generate jwt token
        if(await bcrypt.compare(password, user.password)){
          let token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3h",
          }); 

          user.token = token;                // making a new field of token in user
          await user.save();
          
          user.password = undefined;         // removing password from user object so that hacker cant get it

          const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // aaj ki date se leke agle teen din tk milisecond me

            httpOnly: true, //It makes the cookie inaccessible to JavaScript running in the browser, enhancing security. 
          };

          //sending cookie in response with user and token
          res.cookie("abhayToken", token, options).status(200).json({    //cookie(tokenName, value /data, options)
            success: true,
            token,
            user,
            message: "User Logged in successfully",
          });
        } else {
            //password dont match
            return res.status(403).json({
                success: false,
                message: "Password does not matched",
            });
        } 

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: false,
            message: "Login failure",
        })
    }
}