const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: new Date(),
        once: true,
    },
    jobs: Number,
    national: String,
    firstName: String,
    lastName: String,
    phone: String,
    birthDate: String,
    birthPlace: String,
    livingCity: String,
    known: Number,
    salary: Number,
    coopWay: Number,
    haveExperience: Boolean,
    experience: String,
    busy: Boolean,
    address: String,
    description: String,
});

module.exports = mongoose.model("Jobs", JobSchema);
