const express = require("express");

const {
    register,
    login,
    profile
} = require("../controllers/authController");

const verifyToken =
    require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
    "/profile",
    verifyToken,
    profile
);

module.exports = router;