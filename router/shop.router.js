const router = require("express").Router();

router.get("/", require("./../controller/shop.controller"));

module.exports = router;
