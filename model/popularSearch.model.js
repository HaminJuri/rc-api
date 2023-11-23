const mongoose = require("mongoose");

const PopularSearchSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    value: String,
});

module.exports = mongoose.model("search", PopularSearchSchema);
