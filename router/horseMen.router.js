const Router = require("express").Router();

Router.get("/", require("../controller/horseMen.controller"));

module.exports = Router;
