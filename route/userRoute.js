const router = require("express").Router();
const {
  authentication,
  restrictUser,
} = require("../controller/authController");
const { getAllUsers } = require("../controller/userController");


router.route("/").get(authentication, restrictUser("0"), getAllUsers);

module.exports = router;
