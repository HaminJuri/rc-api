const Router = require("express").Router();
const con = require("./../controller/cart.controller");
const authenticateToken = require("./../middleware/user.middleware");

Router.post("/increment", authenticateToken, con.INCREMENT);
Router.post("/decrement", authenticateToken, con.DECREMENT);
Router.get("/", authenticateToken, con.getUserCart);
Router.patch("/calc-freight/:adrID", authenticateToken, con.calcFreight);
Router.post("/order/request", authenticateToken, con.requestOrder);
Router.get("/order/verify/:paymentId", authenticateToken, con.verifyOrder);
Router.get("/order/:orderStatus", authenticateToken, con.getOrderList);
Router.get("/order/checkout/:orderId", con.checkout);

module.exports = Router;
