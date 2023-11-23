const CategoryModel = require("./../model/category.model");
const BrandModel = require("./../model/brand.model");

const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find().exec();
        const brands = await BrandModel.find().exec();

        return res.status(200).json({ categories, brands });
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

const getListColor = async (req, res) => {
    try {
        const listColors = await CategoryModel.find().select("hexColor hexBg value field1").exec();
        return res.status(200).json(listColors);
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

module.exports = { getAllCategories, getListColor };
