const router = require("express").Router();
const User = require('../models/User')
const Post = require("../models/Post");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/admin'

/*
 *GET/
 *Admin - login page
 */

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with Node JS, Express & MongoDb",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/*
 *POST/
 *Admin - Check Login
 */
 router.post("/admin", async (req, res) => {
  try {
    const {username, password} =req.body

    const user = await User.findOne({username})

    if(!user) {
      return res.status(401).json({message: 'Invalid credentials'})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
      return res.status(401).json({message: 'Invalid credentials'})
    }

    const token = jwt.sign()
    
    // if(req.body.username === 'admin' && req.body.password === 'password') {
    //   res.send("Your are logged in.")
    // } else {
    //   res.send("Wrong username or password")
    // }

    // res.send("ok")
  } catch (error) {
    console.log(error);
  }
});

/*
 *POST/
 *Admin - Register
 */
 router.post("/register", async (req, res) => {
  try {
    const {username, password} =req.body
    
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const user = await User.create({username, password: hashedPassword})
      res.status(201).json({
        message: "User Created",
        user
      })
    } catch (error) {
      if(error.code === 11000) {
        return res.status(409).json({message: 'User already in used'})
      }
      res.status(500).json({message: "Internal server error"})
    }
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
