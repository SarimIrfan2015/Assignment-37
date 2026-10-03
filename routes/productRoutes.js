const express = require("express");

const productController =
    require("../controllers/productController");

const verifyToken =
    require("../middlewares/verifyToken");

const upload =
    require("../middlewares/upload");

const router = express.Router();

router.get(
    "/",
    productController.getProducts
);

router.get(
    "/:id",
    productController.getProduct
);

router.post(
    "/",
    verifyToken,
    upload.single("image"),
    productController.createProduct
);

router.put(
    "/:id",
    verifyToken,
    upload.single("image"),
    productController.updateProduct
);

router.delete(
    "/:id",
    verifyToken,
    productController.deleteProduct
);

module.exports = router;

