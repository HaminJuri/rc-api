const PopularSearchModel = require("./../model/popularSearch.model");
const PopularProductModel = require("./../model/popularProduct.model");

const getAllPopular = async (req, res) => {
    try {
        const popularSearches = await PopularSearchModel.find().exec();
        const popularProduct = await PopularProductModel.find().exec();
        return res.status(200).json({ popularProduct, popularSearches });
    } catch (error) {
        return res.status(500).json({ error: err[500] });
    }
};

module.exports = getAllPopular;
