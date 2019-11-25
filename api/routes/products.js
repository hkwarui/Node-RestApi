const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const productsController = require("../controllers/products");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

//const Product = require("../models/products");
//const upload = multer({ dest: "uploads/" });

router.get("/", productsController.products_get_all);
router.post(
  "/",
  upload.single("productImage"),
  productsController.product_post_one
);
router.get("/:productId", productsController.product_get_one);
router.patch("/:productId", checkAuth, productsController.product_patch_one);
router.delete("/:productId", checkAuth, productsController.product_delete_one);

module.exports = router;
