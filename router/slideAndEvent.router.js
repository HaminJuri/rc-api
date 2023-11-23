const Router = require("express").Router();

Router.get("/", require("../controller/slideAndEvent.controller"));

module.exports = Router;
