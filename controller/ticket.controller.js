const TicketModel = require("./../model/ticket.model");

const addNewTicket = async (req, res) => {
    try {
        const { firstName, lastName, phone, subject, message } = req.body;
        await TicketModel.create({ firstName, lastName, phone, subject, message });
        return res.status(201).json({ message: `تیکت "${subject}" با موفقیت ارسال گردید.` });
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

module.exports = addNewTicket;
