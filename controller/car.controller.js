const Cars = require("./../model/car.model");

const getCars = async (req, res) => {
    try {
        const cars = await Cars.find();
        return res.status(200).json(cars);
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

module.exports = getCars;
