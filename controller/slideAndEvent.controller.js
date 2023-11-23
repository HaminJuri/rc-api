const SlideModel = require("./../model/slide.model");
const EventModel = require("./../model/event.model");

const getSlidesAndEvents = async (req, res) => {
    try {
        const slides = await SlideModel.find().exec();
        const events = await EventModel.find().exec();
        return res.status(200).json({ slides, events });
    } catch (error) {
        return res.status(500).json({ error: "خطا در برقراری ارتباط با سامانه" });
    }
};

module.exports = getSlidesAndEvents;
