const mongoose = require("mongoose");


//Schema
const Schema = mongoose.Schema;
const BlogCommentSchema = new Schema(
  {
    title: { type: String, required: true },

    body: { type: String, required: true },

    date: {
      type: Date,
      default: Date.now,
    },

    post:{ type: Schema.Types.ObjectId, ref: "BlogPost" ,required:true}
  },
  {
    timestamps: true,
  }
);

//Model
const BlogComments = mongoose.model("BlogComments", BlogCommentSchema);

module.exports = BlogComments;
