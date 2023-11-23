const jwt = require("jsonwebtoken");
const UserModel = require("./../model/user.model");

const authenticateToken = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.status(404).json({ error: "کلید دسترسی یافت نشد،\nلطفا وارد اکانت خود شوید." });

    jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
        if (!!err) {
            if (err.name === "TokenExpiredError") {
                const user = await UserModel.findOne({ token }).exec();
                if (user) {
                    user.token = "";
                    user.markModified("token");
                    await user.save();
                }
                return res
                    .status(400)
                    .json({ error: "کلید دسرتسی منقضی شده است،\nلطفا مجدد وارد اکانت خود شوید" });
            } else {
                return res.status(401).json({ error: "لطفا مجدد وارد اکانت خود شوید" });
            }
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
