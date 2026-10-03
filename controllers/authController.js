const {
    registerSchema,
    loginSchema
} = require("../validators/authValidator");

const {
    registerUser,
    loginUser,
    getProfile
} = require("../services/authService");

const register = async (req, res, next) => {
    try {
        const { error, value } =
            registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const user = await registerUser(value);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { error, value } =
            loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await loginUser(
            value.email,
            value.password
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const profile = async (req, res, next) => {
    try {
        const user = await getProfile(req.user.id);

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    profile
};

log