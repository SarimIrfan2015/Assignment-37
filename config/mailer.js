const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendWelcomeEmail = async (email, username) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        console.log("Email credentials are not configured");
        return;
    }

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to E-Commerce API",
        text: `Hello ${username}, welcome to our E-Commerce platform.`
    });
};

module.exports = {
    sendWelcomeEmail
};