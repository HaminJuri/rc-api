const mongoose = require("mongoose");

const ShopStatusModel = new mongoose.Schema({
    isOffline: { type: Boolean, default: false },
    description: { type: String },
    is: { type: String },
});

module.exports = mongoose.model("Shop", ShopStatusModel);
