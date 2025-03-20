const jwt = require("jsonwebtoken");
require("dotenv").config();

//Auth Middleware (Authentication)

exports.auth = (req, res, next) => {
    try {
        //extract JWT Token

        const token = req.body.token;

        if(!token){
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