const router = require("express").Router();
const Post = require("../models/Post");

/*
 *GET/
 *HOME
 */
router.get("", async (req, res) => {
  const locals = {
    title: "Node JS Blog",
    description: "Simple Blog created with Node JS, Express & MongoDb",
  };

  try {
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

/*
 *GET/
 *POST
 */

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with Node JS, Express & MongoDb",
    };

    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

/*
 *POST/
 *Post - searchTerm
 */

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with Node JS, Express & MongoDb",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, '')
    const data = await Post.find({
      $or: [
        {title: {$regex: new RegExp(searchNoSpecialChar,'i')}},
        {body: {$regex: new RegExp(searchNoSpecialChar,'i')}}
      ]
    });
    res.render('search', {
      data, locals
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

// const insertPostData = () => {
//     Post.insertMany([
//         {
//             title: "Building a Blod1",
//             body: "This is the body1"
//         },
//         {
//             title: "Building a Blod2",
//             body: "This is the body2"
//         },
//         {
//             title: "Building a Blod3",
//             body: "This is the body3"
//         },
//         {
//             title: "Building a Blod4",
//             body: "This is the body4"
//         },
//         {
//             title: "Building a Blod5",
//             body: "This is the body5"
//         },
//     ])
// }

// insertPostData()

module.exports = router;
