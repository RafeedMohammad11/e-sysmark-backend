// module.exports = class product {
//     //fetch all products
//     static async getAllProducts(req, res){
//         res.send('Get All Products');
//     }
// }

const fs = require("fs");
const { Product } = require("../models/product");


const getAllProducts = async (req, res) => {
    const { limit = 25, offset = 0 } = req.query;

    try {
        // Convert limit and offset to integers
        const parsedLimit = parseInt(limit);
        const parsedOffset = parseInt(offset);

        // Validate limit and offset
        if (isNaN(parsedLimit) || isNaN(parsedOffset) || parsedLimit <= 0 || parsedOffset < 0) {
            return res.status(400).json({ message: 'Invalid limit or offset values' });
        }

        // Query to get products with pagination
        const products = await Product.find()
            .limit(parsedLimit)
            .skip(parsedOffset);

        // Query to get total product count
        const totalProducts = await Product.countDocuments();

        // Prepare response with count, limit, offset, and products
        const response = {
            count: totalProducts,
            limit: parsedLimit,
            offset: parsedOffset,
            products: products
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getProductById = async (req, res) => {
    //res.send("GET: Product by ID API");
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

const getProductsByCategory = async (req, res) => {
    const category = req.params.category;

    try {
        const products = await Product.find({ category: category });
        
        if (products.length === 0) {
            res.status(404).json({ message: `No products found in the category: ${category}` });
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createProduct = async (req, res) => {
    // res.send("POST: Create Product");
    const product = req.body;
    const imagename = req.file.filename;
    product.image = imagename;
    try {
        await Product.create(product);
        res.status(201).json({
            message: 'Product Created Successfully!'
        })
    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

const updateProduct = async (req, res) => {
    //res.send("PATCH: Product by ID API");
    const id = req.params.id;
    let newImage = '';
    if(req.file){
        newImage = req.file.filename;
        try {
            fs.unlinkSync("/uploads" + req.body.oldImage);
        } catch (error) {
            console.log(error);
        }
    }
    else{
        newImage = req.body.oldImage;
    }

    const newProduct = req.body;
    newProduct.image = newImage;

    try {
        await Product.findByIdAndUpdate(id, newProduct);
        res.status(200).json({message: "Product updated successfully!"});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

const deleteProduct = async (req, res) => {
    //res.send("DELETE: Product by ID API");
    const id = req.params.id;
    try {
        const result = await Product.findByIdAndDelete(id);
        if(result.image != ''){
            try {
                fs.unlinkSync('./uploads'+result.image);
            } catch (error) {
                console.log(error);
            }
            
        }
        res.status(200).json({message: "Product deleted successfully!"});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};





module.exports = {getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory};