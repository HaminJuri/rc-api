const mongoose = require("mongoose");

const SlideSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    title: String,
    imageSrcDesktop: String,
    imageSrcMobile: String,
    href: String,
    sortIt: Number,
});

module.exports = mongoose.model("Slides", SlideSchema);
