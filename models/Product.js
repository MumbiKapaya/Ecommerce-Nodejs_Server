

const mongoose = require("mongoose")
const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, requires: true },
        description: { type: String, require: true },
        image: { type: String, requires: true },
        size: { type: String },
        color: { type: String },
        categories: { type: Array },
        price: { type: Number, requires: true },
        
    },
    {timestamps:true},
);
module.exports = mongoose.model("product", ProductSchema)