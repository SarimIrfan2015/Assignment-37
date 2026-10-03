const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { sendWelcomeEmail } = require("../config/mailer");

const registerUser = async (data) => {
    const existingUser = await User.findOne({
        email: data.email
    });

    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        phone: data.phone
    });

    try {
        await sendWelcomeEmail(user.email, user.username);
    } catch (error) {
        console.log("Welcome email could not be sent:", error.message);
    }

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({
        email
    });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );

    return {
        accessToken: token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone
        }
    };
};

const getProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

module.exports = {
    registerUser,
    loginUser,
    getProfile
};