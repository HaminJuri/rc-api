const mongoose = require("mongoose");

const UserAddressSchema = new mongoose.Schema({
    title: String,
    province: String,
    city: String,
    postal: String,
    receiverName: String,
    receiverPhone: String,
    address: String,
});

const UserSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date(), once: true },
    phone: { type: String, unique: true },
    firstName: String,
    lastName: String,
    national: String,
    landlinePhone: String,
    credit: String,
    known: Number,
    cart: Array,
    auth: { type: Boolean, default: false },
    otp: String,
    token: String,
    birthday: {
        year: { type: String, minlength: 2, maxLength: 4, default: "1300" },
        month: { type: String, minlength: 1, maxLength: 2, default: "01" },
        day: { type: String, minlength: 1, maxLength: 2, default: "01" },
    },
    addresses: [UserAddressSchema],
});

UserSchema.index({ national: 1, auth: 1 });
module.exports = mongoose.model("User", UserSchema);
