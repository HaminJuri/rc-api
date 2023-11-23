const router = require("express").Router();

router.get("/", require("./../controller/car.controller"));

module.exports = router;
