const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    paid: { type: Boolean, default: false },
    orderId: String,
    activeStep: { type: Number, min: 1, max: 4 },
    totalCart: Number,
    totalUserProfit: Number,
    totalPrice: Number,
    freight: Number,
    taxPay: Number,
    paymentPrice: Number,
    paymentId: Number,
    time: { date: String, time: String },
    destination: {
        province: String,
        city: String,
        postal: String,
        receiverName: String,
        receiverPhone: String,
        address: String,
    },
    products: [
        {
            productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
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
    user: {
        firstName: String,
        lastName: String,
        phone: String,
        national: String,
    },
});

module.exports = mongoose.model("order", OrderSchema);
