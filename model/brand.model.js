const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    value: String,
    field1: String,
    field2: String,
    field3: String,
    field4: String,
    field5: String,
    field6: String,
    field7: String,
    field8: String,
    field9: String,
    field10: String,
    soon: { type: Boolean, default: false },
});

module.exports = mongoose.model("brand", BrandSchema);
