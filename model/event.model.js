const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    title: String,
    imageSrcDesktop: String,
    imageSrcMobile: String,
    href: String,
});

module.exports = mongoose.model("event", EventSchema);
