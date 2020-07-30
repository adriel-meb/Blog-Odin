require("dotenv").config();
const express = require("express");
const router = express.Router();
const Blog = require("../models/BlogPost.model");
const Admin = require("../models/User.model");
const Comment = require("../models/Comments.model");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { loginValidation, registerValidation } = require("../config/validation");
const passport = require("passport");
var jwt = require("jsonwebtoken");
const verify= require('./verifyToken')

//! GET all blogs
router.get("/blogs", async (req, res) => {
  try {
    const allBlog = await Blog.find({published:true});
    res.status(200).json(allBlog);
    //console.log(allBlog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal error, please try again", error });
  }
});

//? POST a posts
router.post(
  "/blogs",
  [
    body("title").not().isEmpty().trim(),
    body("body").not().isEmpty().isLength({ min: 5 }),
  ], verify,

  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0] });
    } else {
      const post = new Blog({
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        published: req.body.published,
      });

      try {
       const newPost = await post.save();
        res.status(201).json({ message: "post successfully created" });
        console.log("post successfully created", post);
      } catch (error) {
        console.log("internal error while saving user to DATABASE");
        res
          .status(500)
          .json({ message: "internal error, please try again", error });
      }
    }
  }
);

//+ GET a specific post
router.get("/blogs/:id", async (req, res) => {
  try {
    const singlePost = await Blog.findById(req.params.id);
    res.status(200).json(singlePost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal error, please try again", error });
  }
});

///----------------- COMMENTS API -----------------//////

//!GET the list of comments on a single post
router.get("/blogs/:id/comments", (req, res) => {
  Comment.find({ post: req.params.id }).exec(function (err, data) {
    if (err) return handleError(err);
    //console.log('The stories are an array: ', data);
    res.status(200).json(data);
  });
});

//? POST a comment
router.post("/blogs/:id/comments", async (req, res) => {
  try {
    const singlePost = await Blog.findById(req.params.id);

    const newComment = new Comment({
      title: req.body.title,
      body: req.body.body,
      post: singlePost._id,
    });

    const NewCommentSaved = newComment.save();
    res.status(201).json({ message: "comment added" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal error, please try again", error });
  }
});

///----------------- ADMIN API -----------------//////

//+ Register admin
router.post("/blogs/admin", async (req, res) => {
  //lets validate the data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user already exist
  const emailExist = await Admin.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email already exists");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new Admin({
    last_name: req.body.last_name,
    first_name: req.body.first_name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const newUser = await user.save();
    res
      .status(201)
      .send({ user: user._id, message: "user successfully saved" });
    console.log("user saved to db");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

//+ Sign in admin

/* 
router.post('/blogs/admin/login', passport.authenticate('local'), (req, res) => {
  
  jwt.sign({ user: req.user }, process.env.JWT_PUBLIC_KEY, (err, token) => {
      if (err) return res.json(err);

      // Send Set-Cookie header
      res.cookie('jwt', token, {
          httpOnly: true,
          sameSite: true,
          signed: true,
          secure: true
      });

      // Return json web token
      return res.json({
          jwt: token
      });
  });
});
 */

/* POST login. */
/* router.post('/blogs/admin/login', function (req, res, next) {

  passport.authenticate('local', {session: false}, (err, user, info) => {

      console.log(err);
      if (err || !user) {
          return res.status(400).json({
              message: info ? info.message : 'Login failed',
              user   : user
          });
      }

      req.login(user, {session: false}, (err) => {
          if (err) {
              res.send(err);
          }

          const token = jwt.sign(user, process.env.JWT_PUBLIC_KEY);

          return res.json({user, token});
      });
  })
  (req, res);

}); */

/* POST login. */
router.post(
  "/blogs/admin/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    jwt.sign(
      { user: req.user },
      process.env.JWT_PUBLIC_KEY,
      { expiresIn: "3h" },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        // Send Set-Cookie header
        res.cookie("jwt", token, {
          httpOnly: true,
          sameSite: true,
          signed: true,
          secure: true,
          maxAge: 60 * 60 * 1000 //1 hour
        });

        // Return json web token
        //return res.header('jwt_auth', token).json({ user: req.user, token });
        return res.header('jwt_auth', token).send(token);
      }
    );
  }
);

///EDIT BLOG POST
router.post(
  "/blogs/edit/:id",
  [
    body("title").not().isEmpty().trim(),
    body("body").not().isEmpty().isLength({ min: 5 }),
  ],verify,

  async (req, res) => {
    console.log("PARAMS==",req.params.id)
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("error in validation");
      return res.status(400).json({ errors: errors.array()[0] });
    } else {
      const post = {
        title: req.body.title,
        body: req.body.body,
      };

      try {
        const EditedPost = await Blog.findByIdAndUpdate(req.params.id,post);
        res.status(200).json({ message: "post successfully edited",EditedPost });
        console.log("post successfully edited", post);
      } catch (error) {
        console.log("internal error while editing post to DATABASE");
        res
          .status(500)
          .json({ message: "internal error, please try again", error });
      }
    }
  }
);


///DELETE BLOG
router.delete("/blogs/delete/:id", verify,async (req, res)=>{

  try {
    const deletedBlog= await Blog.findByIdAndRemove(req.params.id)
    res.json({message:"POST DELETED..."})
  } catch (error) {
    console.log("internal error while deleting post....");
    res
      .status(500)
      .json({ message: "internal error, please try again", error });
  }

})


//UPDATE PUBLISHED status
router.post("/blogs/edit/published/:id",async (req, res)=>{

  try {
    const foundBlog= await Blog.findByIdAndUpdate(req.params.id);
    foundBlog.published = !foundBlog.published;
    await foundBlog.save()

    res.json({message:"published status updated..."})
  } catch (error) {
    console.log("internal error while updating post....");
    res
      .status(500)
      .json({ message: "internal error, please try again", error });
  }

})




module.exports = router;
