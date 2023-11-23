const HorseMenModel = require("./../model/horseMen.model");

const setIt = async (req, res) => {
    try {
        const horseMen = await HorseMenModel.find().exec();
        for (let h of horseMen) {
            h.quantity = undefined;
            h.productPrice = 50000;
            h.markModified("productPrice");
            h.userProfit = 20000;
            h.markModified("userProfit");
            h.rcPrice = 30000;
            h.markModified("rcPrice");
            await h.save();
        }
        console.log("DONE");
    } catch (error) {
        console.log("ERROR: ", error.message);
    }
};
// setIt();
const get4HorseMen = async (req, res) => {
    try {
        const horseMen = await HorseMenModel.find().exec();
        return res.status(200).json(horseMen);
    } catch (error) {
        return res.status(500).json({ error: "خطا در برقراری ارتباط با سامانه" });
    }
};

module.exports = get4HorseMen;
