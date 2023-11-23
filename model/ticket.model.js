const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    firstName: String,
    lastName: String,
    phone: String,
    subject: String,
    message: String,
});

module.exports = mongoose.model("ticket", TicketSchema);
