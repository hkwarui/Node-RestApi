const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
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
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
          return res.status(404).json({
            
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:userId", (req, res, next) => {
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
});
module.exports = router;
