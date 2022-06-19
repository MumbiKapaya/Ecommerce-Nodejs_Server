const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
          userId: { type: String, require: true },
    products: [
        {
            productId: { type: String, },
            quantinty: {type :Number, default:1}
        }
        ],
        amount: { type: Number, required: true },
        address: { type: Object, require: true },
    status:{type:String, default:"pending"}


    },{timestamps:true}
)
module.exports = mongoose.model("Order", OrderSchema)