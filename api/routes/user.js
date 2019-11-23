const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, userController.user_get_all);
router.get("/:userId", checkAuth, userController.user_get_one);
router.post("/signup", userController.user_signUp);
router.post("/login", userController.user_login);
router.delete("/:userId", checkAuth, userController.user_delete);
module.exports = router;
