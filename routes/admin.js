require("dotenv").config();
const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";

//Check login
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usreId = decoded.usreId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

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
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ usreId: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/*
 *GET/
 *Admin - Dashboard
 */

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with Node JS, Express & MongoDb",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    res.send(error.message);
  }
});

/*
 *POST/
 *Admin - Register
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({
        message: "User Created",
        user,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "User already in used" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

/*
 *GET/
 *Admin - Create New Post
 */

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with Node JS, Express & MongoDb",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    res.send(error.message);
  }
});

/*
 *POST/
 *Admin - Create New Post
 */

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });

      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.send(error.message);
  }
});

/*
 *GET/
 *Admin - Create New Post
 */

 router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with Node JS, Express & MongoDb",
    };
    const data = await Post.findOne({_id: req.params.id})
    
    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    })

  } catch (error) {
    res.send(error.message);
  }
});

/*
 *PUT/
 *Admin - Create New Post
*/

 router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    })
    
    res.redirect(`/edit-post/${req.params.id}`)

  } catch (error) {
    res.send(error.message);
  }
});

/*
 *DELETE/
 *Admin - Delete Post
*/

 router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.deleteOne({_id: req.params.id})
    res.redirect('/dashboard')
  } catch (error) {
    
    res.send(error.message);
  }
});

/*
 *GET/
 *Admin - LOGOUt
*/

 router.get("/logout", async (req, res) => {
  res.clearCookie('token'),
  res.redirect('/')
});

module.exports = router;
