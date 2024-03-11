const express = require("express");
const router = express.Router();
const {
    registerUser,
    generateNewPassword,
    loginUser,
    getCourses,
    getCourseData,
    getUserFees,
    getUserHistory,
    getCart,
    addToCart,
    checkout,
} = require("./controllers");

// TODO: Add audit logging to all methods in controller.js

router.post("/registration", registerUser);
router.post("/login", loginUser);

router.post("/generateNewPassword", generateNewPassword);

router.get("/courses", getCourses);
router.get("/courses/:id", getCourseData); // TODO: Implement Method (Gets course Description, Cost per credit etc...)

router.get("/user/fees", getUserFees); // TODO: get user fees for registered courses
router.get("/user/history", getUserHistory); // TODO: get user history of courses

router.get("/cart", getCart);
router.post("/cart", addToCart); // TODO: Fix Implemented Method (clear old cart and add new cart items per user)
router.post("/checkout", checkout); // TODO: register user to all courses in checkout and clear cart

module.exports = router;
