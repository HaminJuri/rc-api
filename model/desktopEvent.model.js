const mongoose = require("mongoose");

const DesktopEventSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    title: String,
    img: String,
    href: String,
});

module.exports = mongoose.model("desktop-event", DesktopEventSchema);
