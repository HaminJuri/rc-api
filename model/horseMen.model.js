const mongoose = require("mongoose");

const HorseMenSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    title: String,
    serialNumber: { type: Number, require: true },
    productPrice: { type: Number, require: true },
    userProfit: { type: Number, require: true },
    rcPrice: { type: Number, require: true },
    category: Number,
    quantity: Number,
    image: String,
    tags: [String],
    productID: mongoose.Schema.Types.ObjectId,
    expireDate: Date,
});

module.exports = mongoose.model("HorseMen", HorseMenSchema);
