const Product = require("../models/product");
const express = require("express");
const router = express.Router();
const multer = require('multer');

//multer middleware
let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
});

let upload = multer({
    storage: storage
}).single("image");


const {getAllProducts, getProductById, createProduct, updateProduct, deleteProduct} = require('../controllers/product');

// router.get("/", getAllProducts);
//router.post("/create-product", createProduct);

router.get(
    "/",
    getAllProducts
);

router.get(
    "/:id",
    getProductById
)

router.post(
    "/create-product",
    upload, //upload middleware 
    createProduct
)

router.patch(
    "/:id",
    upload,
    updateProduct
)

router.delete(
    "/:id",
    deleteProduct
)

module.exports = router;