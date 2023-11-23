const router = require("express").Router();
let con = require("./../controller/product.controller");

router.get("/", con.getAllProducts);
router.get("/:serialNumber", con.getProduct);

module.exports = router;
