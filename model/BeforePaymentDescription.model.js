const mongoose = require("mongoose");

const BeforePaymentDescription = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    description: String,
    is: String,
});

module.exports = mongoose.model("BeforePaymentDescription", BeforePaymentDescription);
