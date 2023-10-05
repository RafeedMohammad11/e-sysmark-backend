const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    category: String,
    description: String,
    brand: String,
    price: Number,
    image: String,
    created: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product, productSchema };