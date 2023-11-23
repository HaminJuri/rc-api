const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userPhone: { type: String, require: true },
    products: [
        {
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: Number,
            name: String,
            serialNumber: Number,
            productPrice: Number,
            rcPrice: Number,
            userProfit: Number,
            imageSrc: String,
            maxQuantity: Number,
        },
    ],
    totalPrice: { type: Number, default: 0 },
    totalUserProfit: { type: Number, default: 0 },
    totalCart: { type: Number, default: 0 },
    freight: { type: Number, default: 0 },
    paymentPrice: { type: Number, default: 0 },
    destination: {
        _id: mongoose.Schema.Types.ObjectId,
        province: String,
        city: String,
        postal: String,
        receiverName: String,
        receiverPhone: String,
        address: String,
    },
});

module.exports = mongoose.model("Cart", CartSchema);
