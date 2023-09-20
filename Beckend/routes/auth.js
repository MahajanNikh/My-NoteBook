const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var JWT_SECRET = "Nikhilisagood$oy";

var fetchuser = require("../middleware/fetchuser");

//Router 1. create user using : post  "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Not a Valid Name , Name should contain 3 alphabates"),
    body("email").isEmail().withMessage("Not a valid e-mail address"),
    body("password")
      .isLength({ min: 5 })
      .withMessage(
        "Not a Valid Password , Password should contain 5 alphabates "
      ),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors, return bad request and the erros

    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.send({ success, errors: result.array() });
    }

    try {
      // check whether the user with same email exits already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, result: "user Alerady Exist" });
      }
      var salt = bcrypt.genSaltSync(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      // create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });
      //   .then((user) => res.json(user))
      const data = {
        user: {
          id: user.id,
        },
      };
      //var jwtData = jwt.sign(data,JWT_SECRET);
      var authToken = jwt.sign({ data }, JWT_SECRET);
      // console.log(authToken);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Router 2. create user using : post  "/api/auth/login ". No login required
router.post(
  "/login",
  [
    body("email", "Not a valid e-mail address").exists(),
    body("password", "password can not be Blank").exists(),
    // body("password").withMessage("password can not be blank").exists(),
  ],
  async (req, res) => {
    // if there is error, return  Bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.send({ errors: result.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }); //email: req.body.email
      if (!user) {
        let success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        let success = false;
        return res.status(400).json({
          success,
          result: "Please try to login with correct credentials",
        });
        //return res.status(400).json({error: "Please try to login with correct credentials2"});
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      //var authToken = jwt.sign(data,JWT_SECRET);
      var authToken = jwt.sign({ data }, JWT_SECRET);
      // console.log(authToken);
      let success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      let success = false;
      res.status(500).send(success, "Internal Server Error");
    }
  }
);

// Router 3. Get Loggin User Details using : POST "/api/auth/getuser". login Required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
