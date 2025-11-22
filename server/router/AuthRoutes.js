const express = require("express");
const router = express.Router();
const { signUp, signIn, getCurrentUser } = require("../controller/auth.controller");
const auth = require("../middleware/auth");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", auth, getCurrentUser);

module.exports = router;

