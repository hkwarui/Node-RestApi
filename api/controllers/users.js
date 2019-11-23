const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
exports.user_get_all = (req, res, next) => {
  User.find()
    .select("email _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            email: doc.email,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/user/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_get_one = (req, res, next) => {
  User.findById(req.params.userId)
    .select("email _id")
    .exec()
    .then(doc => {
      console.log(doc);
      const response = {
        email: doc.email,
        _id: doc._id,
        request: {
          type: "GET",
          url: "http://localhost:3000/user"
        }
      };
      res.status(200).json({
        User: response
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.user_signUp = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcryptjs.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  User: user
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err._message
                });
              });
          }
        });
      }
    });
};
exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(404).json({
          message: "Auth Failed."
        });
      }
      bcryptjs.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(404).json({
            message: "Auth Failed."
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            "secret",
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            message: "Auth Successful.",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth Failed."
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
exports.user_delete = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted!"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
