const router = require("express").Router();
const Post = require("../models/Post");

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

module.exports = router;
