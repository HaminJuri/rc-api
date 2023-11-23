const router = require("express").Router();
const con = require("./../controller/user.controller");
const authenticateToken = require("../middleware/user.middleware");

router.post("/send-otp", con.sendOtp);
router.post("/check-otp", con.checkOtp);
router.post("/register", con.registerUser);
router.get("/", authenticateToken, con.getUserInfo);
router.get("/check-auth-by-jwt", authenticateToken, con.checkAuthByJWT);
router.patch("/update", authenticateToken, con.updateUserInfo);
router.patch("/addresses/add", authenticateToken, con.addNewAddress);
router.delete("/addresses/delete/:addressID", authenticateToken, con.removeUserAddressByID);

module.exports = router;
