const fs = require("fs");

const cloudinary = require("../config/cloudinary");

const {
    productSchema
} = require("../validators/productValidator");

const productService = require("../services/productService");

const uploadToCloudinary = async (filePath) => {
    const result = await cloudinary.uploader.upload(
        filePath,
        {
            folder: "ecommerce-products"
        }
    );

    await fs.promises.unlink(filePath);

    return result.secure_url;
};

const getProducts = async (req, res, next) => {
    try {
        const result =
            await productService.getAllProducts(req.query);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const product =
            await productService.getProductById(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    let temporaryFile = req.file?.path;

    try {
        let imageUrl = "";

        if (req.file) {
            imageUrl =
                await uploadToCloudinary(req.file.path);

            temporaryFile = null;
        }

        const data = {
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            stock: Number(req.body.stock),
            image: imageUrl
        };

        const { error, value } =
            productSchema.validate(data);

        if (error) {
            if (temporaryFile) {
                await fs.promises
                    .unlink(temporaryFile)
                    .catch(() => { });
            }

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const product =
            await productService.createProduct(value);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        if (temporaryFile) {
            await fs.promises
                .unlink(temporaryFile)
                .catch(() => { });
        }

        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    let temporaryFile = req.file?.path;

    try {
        const data = {
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            stock: Number(req.body.stock)
        };

        if (req.file) {
            data.image =
                await uploadToCloudinary(req.file.path);

            temporaryFile = null;
        }

        const { error, value } =
            productSchema.validate(data);

        if (error) {
            if (temporaryFile) {
                await fs.promises
                    .unlink(temporaryFile)
                    .catch(() => { });
            }

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const product =
            await productService.updateProduct(
                req.params.id,
                value
            );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        if (temporaryFile) {
            await fs.promises
                .unlink(temporaryFile)
                .catch(() => { });
        }

        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product =
            await productService.deleteProduct(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};