const router = require("express").Router();

router.post("/apply", require("./../controller/jobs.controller"));

module.exports = router;
