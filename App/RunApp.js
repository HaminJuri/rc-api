require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

module.exports = new (class AppCls {
    app;
    constructor() {
        this.expressConfig();
        this.basicConfig();
        this.mongooseConnection();
        this.globalHelpers();
        this.routes();
        this.listen();
    }
    expressConfig() {
        this.app = express();
    }
    basicConfig() {
        this.app.use(
            cors({
                credentials: true,
                origin: [
                    "http://localhost:3000",
                    "http://localhost:3001",
                    "https://rcc.iran.liara.run",
                    "https://roghanicar.com",
                    "https://www.roghanicar.com",
                ],
            })
        );
        this.app.use(express.json());
        this.app.use(helmet());
    }
    mongooseConnection() {
        mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error: "));
        db.once("open", () => {
            if (process.env.NODE_ENV === "DEV") {
                return console.log("✅ DB Connected");
            }
        });
    }

    globalHelpers() {
        global.err = require("./../helpers/err");
        global.prd = require("./../helpers/persian_date_helper");
        global.rand = require("./../helpers/rand_helper");
        global.delay = require("./../helpers/delay");
        global.p2eNum = require("./../helpers/persian2english");
    }

    routes() {
        this.app.use("/", require("./../router"));
    }
    listen() {
        this.PORT = process.env.PORT || 4444;
        this.app.listen(this.PORT, () => {
            if (process.env.NODE_ENV === "DEV") {
                return console.log(`✅ App is running on port: ${this.PORT}`);
            }
        });
    }
})();
