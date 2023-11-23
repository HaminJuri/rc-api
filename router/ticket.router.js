const Router = require("express").Router();

Router.post("/", require("./../controller/ticket.controller"));

module.exports = Router;
