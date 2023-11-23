const mongoose = require("mongoose");

const PopularProduct = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    serialNumber: String,
    img: String,
    title: String,
    subtitle: String,
});

module.exports = mongoose.model("popularProduct", PopularProduct);
