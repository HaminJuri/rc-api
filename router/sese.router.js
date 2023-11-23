const Router = require("express").Router();

Router.get("/", require("../controller/sese.controller"));

module.exports = Router;
