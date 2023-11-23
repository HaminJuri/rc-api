const router = require("express").Router();

router.use("/horse-men", require("./horseMen.router"));
router.use("/slides-and-events", require("./slideAndEvent.router"));
router.use("/sese", require("./sese.router"));
router.use("/category", require("./category.router"));
router.use("/products", require("./product.router"));
router.use("/cars", require("./car.router"));
router.use("/user", require("./user.router"));
router.use("/shop", require("./shop.router"));
router.use("/jobs", require("./jobs.router"));
router.use("/cart", require("./cart.router"));
router.use("/desktop-events", require("./desktopEvent.router"));
router.use("/ticket", require("./ticket.router"));

module.exports = router;
