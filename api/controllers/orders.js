const Order = require("../models/order");
const Product = require("../models/products");
const mongoose = require("mongoose");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.order_post_one = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Orders was created!",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.order_get_one = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .populate("product")
    .select("product quantity _id")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          order: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/"
          }
        });
      } else {
        res.status(404).json({
          message: "Order not Found !"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.order_delete_one = (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order Deleted",
        request: {
          type: "  POST",
          url: "http://localhost:3000/orders/",
          body: { productId: "ObjectId", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
