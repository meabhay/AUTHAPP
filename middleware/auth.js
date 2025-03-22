const jwt = require("jsonwebtoken");
require("dotenv").config();

//Auth Middleware (Authentication)

exports.auth = (req, res, next) => {
    try {
        //extract JWT Token

        console.log("body", req.body.token);
        console.log("cookie", req.cookies.token);
        console.log("header", req.header("Authorization"));
        
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");     //Three methods for fetching token
         // req.header("Authorization").replace("Bearer", ""); //  ( This will give "BEARER" <token>)   // replace bearer with ""


        if(!token || token === undefined){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        //verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);       //gives token in decoded form with all information, if token is verified

            console.log(payload);
            
            req.user = payload;        //we inserted payload to req.user so that role can be accessed in next middleware 
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
                success: false,
                message: "Something went wrong while verifying token",
            })
    }
}


//isStuent middleware (Authorization)

exports.isStudent = (req, res, next) => {
    try {
        if(req.user.role !== "Student"){
            return res.status(401).json({
              success: false,
              message: "This is a protected route for students",
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
          success: false,
          message: "User role is not matching",
        });
    }
}



//isAdmin middleware(Authorization)

exports.isAdmin = (req, res, next) => {
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
              success: false,
              message: "This is a protected route for Admin",
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
          success: false,
          message: "User role is not matching",
        });
    }
}