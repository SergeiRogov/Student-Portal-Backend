const bcrypt = require("bcrypt")
const db = require("./db");
const Response = require("./response");
const saltRounds = 10;

const registerUser = (req, res) => {
    const users = db.getCollection("users") || db.addCollection("users");
    const { firstName,
    surname,
    gender,
    email,
    dateOfBirth,
    nationality,
    telephone,
    cardNumber,
    country,
    region,
    city,
    street,
    house,
    flat,
    username,
    password } = req.body; 

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password:", err);
            res.status(Response.FAIL).json(Response.internalServerError);
            return;
        }

        const insertedUser = users.insert({
            firstName,
            surname,
            gender,
            email,
            dateOfBirth,
            nationality,
            telephone,
            cardNumber,
            country,
            region,
            city,
            street,
            house,
            flat,
            username,
            password: hashedPassword,  
        }); 

        const registerResponse = new Response(
            Response.SUCCESS,
            insertedUser,
            "User Registered Successfully"
        );

        res.status(Response.SUCCESS).json(registerResponse);
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

    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
    let password = '';

    // random length between 6 and 17
    const passwordLength = Math.floor(Math.random() * (17 - 6 + 1)) + 10;

    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(Response.FAIL).json(Response.internalServerError);
            return;
        }

        user.password = hash;
        users.update(user);
        const newPasswordResponse = new Response(Response.SUCCESS, { generatedPassword: password }, null);
        res.status(Response.SUCCESS).json(newPasswordResponse);
    });
}

const getCourses = (req, res) => {
    const courses = db.getCollection("courses");
    if (!courses) {
        res.status(Response.NOT_FOUND).json(Response.notFoundError("Courses not found"));
        return;
    }

    try {
        const allCourses = courses.find();
        const allCoursesResponse = new Response(Response.SUCCESS, { courses: allCourses }, null);
        res.status(Response.SUCCESS).json(allCoursesResponse);
    } catch (error) {
        console.error("Error fetching courses:", error);
        
        res.status(Response.FAIL).json(Response.failure("Failed to fetch courses"));
    }
};

const getCourseData = (req, res) => {}

const getCart = (req, res) => {
    const cart = db.getCollection("cart");
    if (!cart || cart.length === 0) {
        res.status(Response.NOT_FOUND).json(Response.notFoundError("Cart is empty"));
        return;
    }

    try {
        const allCartItems = cart.find();
        const allCartItemsResponse = new Response(Response.SUCCESS, { cart: allCartItems }, null);
        res.status(Response.SUCCESS).json(allCartItemsResponse);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(Response.FAIL).json(Response.failure("Failed to fetch cart"));
    }
}

const addToCart = (req, res) => {
    try {
        const cart = db.getCollection("cart") || db.addCollection("cart");
        if (!req.body) {
            throw new Error("Course data missing in request body");
        }
        const { id,
            title,
            description,
            lecturer,
            details,
            price } = req.body; 

        const existingCourse = cart.findOne({ id });
        if (existingCourse) {
            res.status(Response.SUCCESS).send("Course is already in the cart");
            return;
        }

        cart.insert({ id,
            title,
            description,
            lecturer,
            details,
            price }); 

        res.status(Response.SUCCESS).send("Course added to cart");
    } catch (error) {
        console.error("Error adding course to cart:", error.message);
        res.status(Response.FAIL).send("Failed to add course to cart: " + error.message);
    }
};

const clearCart = (req, res) => {
    try {
        const cart = db.getCollection("cart") || db.addCollection("cart");
        cart.clear();
        res.status(Response.SUCCESS).send("Cart is cleared");
    } catch (error) {
        console.error("Error clearing cart:", error.message);
        res.status(Response.FAIL).send("Error clearing cart: " + error.message);
    }
};

const removeFromCart = (req, res) => {
    try {
        if (!req.body) {
            throw new Error("Course data missing in request body");
        }
        const cart = db.getCollection("cart");
        const { courseIDToRemove } = req.body;
        const removedCourse = cart.findOne(course => course.id === courseIDToRemove);
        const message = removedCourse ?  "Course removed from cart" : "Course not found in cart";
        if (removedCourse) {
            cart.remove(removedCourse);
        } 
        res.status(Response.SUCCESS).send(message);
    } catch (error) {
        console.error("Error removing course to cart:", error.message);
        res.status(Response.FAIL).send("Error removing course to cart: " + error.message);
    }
};

const getUserFees = (req, res) => {}
const getUserHistory = (req, res) => {}

const checkout = (req, res) => {
    // add credit card validation we can find on google
    res.status(Response.SUCCESS).send("Payment processed successfully"); // TODO: Generate proper response
};

module.exports = { registerUser, loginUser, generateNewPassword, getCourses, getCourseData, getUserFees, getUserHistory, getCart, addToCart, clearCart, removeFromCart, checkout };
