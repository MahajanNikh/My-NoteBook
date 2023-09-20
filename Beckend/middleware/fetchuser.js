// const { response } = require("express");
// var jwt = require("jsonwebtoken");
// var JWT_SECRET = "Nikhilisagood$oy";

// const fetchuser = (req, res, next) => {
//   next();
//   //   Get the user from the jwt token and add Id to req object
//   const token = req.header("auth.token");
//   if (!token) {
//     res.status(401).send({ error: "please authenticate using a valid token" });
//   }
//   try {
//     const data = jwt.verify(token, JWT_SECRET);
//     // console.log(data);
//     req.user = data.user;
//     next();
//   } catch (error) {
//     res.status(401).send({ error: "please authenticate using a valid token" });
//   }
// };
// module.exports = fetchuser;


var jwt = require('jsonwebtoken');
var JWT_SECRET = "Nikhilisagood$oy";

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}


module.exports = fetchuser;
