const router = require("express").Router();

router.get("/", require("./../controller/suggested.controller"));

module.exports = router;
