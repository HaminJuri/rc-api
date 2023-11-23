const DesktopEventModel = require("./../model/desktopEvent.model");

const get2DesktopEvent = async (req, res) => {
    try {
        const desktopEvents = await DesktopEventModel.find().exec();
        return res.status(200).json(desktopEvents);
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

module.exports = get2DesktopEvent;
