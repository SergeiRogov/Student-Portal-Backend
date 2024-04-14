const bcrypt = require("bcrypt")
const uuid = require("uuid"); 
const db = require("./db");
const Response = require("./response");
const jwt = require('jsonwebtoken');
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

    const existingUser = users.findOne({ username: username });

    if (existingUser) {
        res.status(Response.NOT_AUTHORIZED).json(Response.unauthorized);
        return;
    }

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password:", err);
            res.status(Response.FAIL).json(Response.internalServerError);
            return;
        }

        const userID = uuid.v4();

        const insertedUser = users.insert({
            userID,
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
            cart: [],
            history: [],
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
    const { username, password } = req.body;
    const user = users.findOne({ username });

    if (!user) {
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
        if (result) {
            const token = jwt.sign({ userID: user.userID }, '123456', {
                expiresIn: '10s',
                });
            const loginResponse = new Response(
                Response.SUCCESS,
                {
                    userID: user.userID,
                    username: user.username,
                    token: token,
                },
                "User Logged In Successfully"
            );
            res.status(Response.SUCCESS).json(loginResponse);
        } else {
            res.status(Response.NOT_AUTHORIZED).json(Response.unauthorized);
        }
    });
};

const generateNewPassword = (req, res) => {
    const users = db.getCollection("users");
    const { username } = req.body;
    const user = users.findOne({ username });

    if (!user) {
        // User not found, return 401 (Unauthorized)
        res.status(Response.NOT_AUTHORIZED).json(Response.unauthorized);
        return;
    }

    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
    let password = '';
    
    const minLen = 6;
    const maxLen = 20;
    // random length between minLen and maxLen
    const passwordLength = Math.floor(Math.random() * (maxLen - minLen + 1)) + 10;

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
        res.status(Response.NO_CONTENT).send();
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

    try {
        const users = db.getCollection("users");
        if (!users || users.length === 0) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        const { userID } = req.query;

        const user = users.findOne({ userID: userID });
        if (!user) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        const courses = db.getCollection("courses");

        const cartItemIDs = user.cart;
        const allUserCartItems = cartItemIDs.map(courseID => courses.findOne({ id: courseID }));

        const allCartItemsResponse = new Response(Response.SUCCESS, { cartCourses: allUserCartItems }, null);
        res.status(Response.SUCCESS).json(allCartItemsResponse);
        
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(Response.FAIL).json(Response.failure("Failed to fetch cart"));
    }
}

const addToCart = (req, res) => {
    try {
        const users = db.getCollection("users");
        if (!users) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        const { userID, courseToAddID } = req.body;

        const user = users.findOne({ userID: userID });
        if (!user) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        if (user.cart.includes(courseToAddID)) {
            res.status(Response.SUCCESS).send("Course is already in the cart");
            return;
        }

        user.cart.push(courseToAddID);

        users.update(user);

        res.status(Response.SUCCESS).send("Course added to cart");

    } catch (error) {
        console.error("Error adding course to cart:", error.message);
        res.status(Response.FAIL).send("Failed to add course to cart: " + error.message);
    }
};

const clearCart = (req, res) => {
    try {
        const users = db.getCollection("users");
        if (!users) {
            res.status(Response.NO_CONTENT).send();
            return;
        }
        const { userID } = req.body;
        const user = users.findOne({ userID: userID });

        if (!user) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        user.cart = [];

        users.update(user);

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

        const { userID, courseIDToRemove } = req.body;
        const users = db.getCollection("users");

        const user = users.findOne({ userID: userID });
        if (!user) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        const cart = user.cart; 
        if (!cart) {
            res.status(Response.FAIL).json(Response.failure("No cart"));
            return;
        }
        
        user.cart = cart.filter(courseID => courseID !== courseIDToRemove);
        users.update(user);
        res.status(Response.SUCCESS).send("Course removed from cart");
     
    } catch (error) {
        console.error("Error removing course to cart:", error.message);
        res.status(Response.FAIL).send("Error removing course to cart: " + error.message);
    }
};

const getUserFees = (req, res) => {}

const getUserHistory = async (req, res) => {

    try {
        const users = db.getCollection("users");
        if (!users || users.length === 0) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        const { userID } = req.query;

        const user = users.findOne({ userID: userID });
        if (!user) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        const courses = db.getCollection("courses");
        const historyItemIDs = user.history;
    
        const allUserHistoryItems = courses.find({ id: { $in: historyItemIDs } });

        const allHistoryItemsResponse = new Response(Response.SUCCESS, { historyCourses: allUserHistoryItems }, null);
        res.status(Response.SUCCESS).json(allHistoryItemsResponse);
        
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(Response.FAIL).json(Response.failure("Failed to fetch history"));
    }
}

const addToHistory = (req, res) => {

    try {
        const users = db.getCollection("users");
        if (!users) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        const { userID, coursesToBuyIDs } = req.body;

        const user = users.findOne({ userID: userID });
        if (!user) {
            res.status(Response.NO_CONTENT).send();
            return;
        }

        const newCourseIDs = coursesToBuyIDs.filter(
            (courseID) => !user.history.includes(courseID)
        );

        user.history.push(...newCourseIDs);

        user.cart = [];

        users.update(user);

        res.status(Response.SUCCESS).send("Payment processed successfully"); // TODO: Generate proper response

    } catch (error) {
        console.error("Error purchasing courses:", error.message);
        res.status(Response.FAIL).send("Failed to add course to cart: " + error.message);
    }
    
};

module.exports = { registerUser, loginUser, generateNewPassword, getCourses, getCourseData, getUserFees, getUserHistory, getCart, addToCart, clearCart, removeFromCart, getUserHistory, addToHistory };
