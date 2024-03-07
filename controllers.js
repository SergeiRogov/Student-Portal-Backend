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
    const { username, password } = req.body;
    const user = users.findOne({ username });

    if (user) {
        // Check if the password matches the hashed password stored in the database
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                res.status(Response.FAIL).json(Response.internalServerError);
                return;
            }

            if (result) {
                // Login successful
                res.status(Response.SUCCESS).send("Login successful"); // TODO: Generate proper response
            } else {
                // Incorrect password
                res.status(Response.NOT_AUTHORIZED).json(Response.unauthorized);
            }
        });
    } else {
        // User not found
        res.status(unauthorizedResponse.status).send(unauthorizedResponse);
    }
};

const getCourses = (req, res) => {
    const courses = db.getCollection("courses");
    const allCourses = courses.find();
    res.status(Response.SUCCESS).json(allCourses);
};

const getCourseData = (req, res) => {}
const getUserFees = (req, res) => {}
const getUserHistory = (req, res) => {}
const getCart = (req, res) => {}

const addToCart = (req, res) => {
    const cart = db.getCollection("cart") || db.addCollection("cart");
    cart.insert(req.body); // TODO: fix input received from body
    res.status(Response.SUCCESS).send("Course added to cart");
};

const checkout = (req, res) => {
    // add credit card validation we can find on google
    res.status(Response.SUCCESS).send("Payment processed successfully"); // TODO: Generate proper response
};

module.exports = { registerUser, loginUser, getCourses, getCourseData, getUserFees, getUserHistory, getCart, addToCart, checkout };
