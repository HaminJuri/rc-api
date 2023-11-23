const ShopState = require("./../model/shopStatus.model");

const getState = async (req, res) => {
    try {
        const { isOffline } = await ShopState.findOne({ is: "RC" });
        return res.status(200).json(isOffline);
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

module.exports = getState;
