const { response } = require("express");
const { ObjectId } = require("mongodb");
const projectsModel = require("../models/projects");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt
const { getUsers } = require("../models/projects");
const jwt = require("jsonwebtoken");


// Render the login form with default data
const buildLogin = async (req, res) => {
    try {
        res.render("login", { title: "Login" });
    } catch (error) {
        console.error("Error rendering login form:", error);
        res.status(500).json({ error: "Error rendering login form" });
    }
};

// Render the registration form with default data
const buildRegister = async (req, res) => {
    try {
        const defaultData = {
            username: "testuser",
            password: "password123"
        };
        res.render("register", { title: "Register", user: defaultData });
    } catch (error) {
        console.error("Error rendering register form:", error);
        res.status(500).json({ error: "Error rendering register form" });
    }
};

// Register a new user
const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Fetch the users collection
        const usersCollection = await getUsers();

        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const newUser = { username, password: hashedPassword };
        await usersCollection.insertOne(newUser);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Login a user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            req.flash("error", "Please fill in all fields");
            return res.redirect("/auth/login");
        }

        const usersCollection = await getUsers();
        const user = await usersCollection.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/auth/login");
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("jwt", token, { httpOnly: true, secure: false });
        req.flash("success", "Login successful");
        res.redirect("/projects");
    } catch (error) {
        console.error("Error logging in user:", error);
        req.flash("error", "An error occurred during login");
        res.redirect("/auth/login");
    }
};

// Logout a user
const logout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
};

module.exports = { buildLogin, buildRegister, register, login, logout };