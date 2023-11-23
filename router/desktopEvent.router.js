const Router = require("express").Router();

Router.get("/", require("./../controller/desktopEvent.controller"));

module.exports = Router;
