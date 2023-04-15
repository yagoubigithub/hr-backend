const User = require("../models/User");
const { errorHandler } = require("../helpers/dbErrorHandler");

const jwt = require("jsonwebtoken"); //to generate sign token
const expressJwt = require("express-jwt"); // for authorization

exports.signup = (req, res) => {
  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        err: errorHandler(err),
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;

    // generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    //pressist the token as 't' in cookiewith ewpiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return token and user to frontend client

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signin = (req, res) => {
  //find user based on email
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email doesn't exist.",
      });
    }

    //if user is found make sure the email and password match

    // create authenticate method in user model

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password don't match",
      });
    }
    // generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    //pressist the token as 't' in cookiewith ewpiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return token and user to frontend client

    const { _id, firstname , lastname , username, email, role } = user;
    return res.json({ token, user: { _id, firstname , lastname , username, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resourse! Access denied",
    });
  }
  next();
};
