const mongoose = require("mongoose");

//Schema
const Schema = mongoose.Schema;
const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },

    body: { type: String, required: true },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },

    published: {
      required: true,
      type: Boolean,
      default:true,
    },


    comments: [{ type: Schema.Types.ObjectId, ref: "BlogComments" }],
  },
  {
    timestamps: true,
  }
);

//Model
const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

module.exports = BlogPost;
