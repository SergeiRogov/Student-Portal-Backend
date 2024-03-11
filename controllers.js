const bcrypt = require("bcrypt")
const db = require("./db");
const Response = require("./response");
const saltRounds = 10;

const registerUser = (req, res) => {
    const users = db.getCollection("users") || db.addCollection("users");
    const { username, password } = req.body; // TODO: fill in the input from the form

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password:", err);
            res.status(Response.FAIL).json(Response.internalServerError);
            return;
        }

        const insertedUser = users.insert({
            username,
            password: hashedPassword,
        }); // TODO: Save the registration form to db here

        const registerResponse = new Response(
            200,
            insertedUser,
            "User Registered Successfully"
        );

        res.status(registerResponse.status).json(registerResponse);
    });
};

const loginUser = (req, res) => {
    const users = db.getCollection("users");
    console.log(req.body);
    const { username, password } = req.body;
    const user = users.findOne({ username });

    if (!user) {
        // User not found, return 401 (Unauthorized)
        res.status(Response.NOT_AUTHORIZED).json(Response.unauthorized);
        return;
    }

    // Check if the password matches the hashed password stored in the database
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            console.error("Error comparing passwords:", err);
            res.status(Response.FAIL).json(Response.internalServerError);
            return;
        }
        console.log(user.password, user.username)
        if (result) {
            // Login successful
            res.status(Response.SUCCESS).send("Login successful"); // TODO: Generate proper response
        } else {
            // Incorrect password
            res.status(Response.NOT_AUTHORIZED).json(Response.unauthorized);
        }
    });

};

const generateNewPassword = (req, res) => {
    const users = db.getCollection("users");
    console.log(req.body);
    const { username } = req.body;
    const user = users.findOne({ username });

    if (!user) {
        // User not found, return 401 (Unauthorized)
        res.status(Response.NOT_AUTHORIZED).json(Response.unauthorized);
        return;
    }

    // todo
}

const getCourses = (req, res) => {
    const courses = db.getCollection("courses");
    const allCourses = courses.find();
    res.status(Response.SUCCESS).json(allCourses);
};

const getCourseData = (req, res) => {}

const getCart = (req, res) => {
    const cart = db.getCollection("cart");
    const allCartItems = cart.find();
    res.status(Response.SUCCESS).json(allCartItems);
}

const getUserFees = (req, res) => {}
const getUserHistory = (req, res) => {}

const addToCart = (req, res) => {
    const cart = db.getCollection("cart") || db.addCollection("cart");
    cart.insert(req.body); // TODO: fix input received from body
    res.status(Response.SUCCESS).send("Course added to cart");
};

const checkout = (req, res) => {
    // add credit card validation we can find on google
    res.status(Response.SUCCESS).send("Payment processed successfully"); // TODO: Generate proper response
};

module.exports = { registerUser, loginUser, generateNewPassword, getCourses, getCourseData, getUserFees, getUserHistory, getCart, addToCart, checkout };
