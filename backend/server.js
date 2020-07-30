require("dotenv").config();
const express = require("express");
//const passport = require("passport");
const mongoose = require("mongoose");
var cors = require("cors");
const morgan = require("morgan");
const apiRoute = require("./routes/api_Routes");
var cookieParser = require("cookie-parser");

require("./config/passport");

const app = express();

//connect to mongo
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/OdinProject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("mongo DB connected..."))
  .catch((err) => console.log(err));

//HTTP request logger middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(cookieParser(process.env.JWT_PUBLIC_KEY));
//app.use(passport.initialize());

//USe Routes
app.use("/api", apiRoute);


/* if(process.env.NODE_ENV ==='production'){

} */

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("App listening on port ", port);
});
