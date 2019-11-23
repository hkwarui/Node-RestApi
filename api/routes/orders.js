const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const ordersController = require("../controllers/orders");

router.get("/", checkAuth, ordersController.orders_get_all);
router.post("/", checkAuth, ordersController.order_post_one);
router.get("/:orderId", checkAuth, ordersController.order_get_one);
router.delete("/:orderId", checkAuth, ordersController.order_delete_one);

module.exports = router;
