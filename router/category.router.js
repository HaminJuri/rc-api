const Router = require("express").Router();
const con = require("./../controller/category.controller");

Router.get("/", con.getAllCategories);
Router.get("/list-color", con.getListColor);

module.exports = Router;
