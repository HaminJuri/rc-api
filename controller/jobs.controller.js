const JobsModel = require("./../model/job.model");
const jobSms = require("./../libs/job.sms");

async function applyIt(req, res) {
    try {
        const {
            jobs,
            national,
            firstName,
            lastName,
            phone,
            birthDate,
            birthPlace,
            livingCity,
            known,
            salary,
            coopWay,
            haveExperience,
            experience,
            busy,
            address,
            description,
        } = req.body;

        const alreadyExist = await JobsModel.findOne({ phone }).exec();
        if (alreadyExist) {
            return res.status(409).json({
                statusCode: 409,
                statusMessage: "Already Exist",
            });
        }

        JobsModel.create({
            jobs,
            national,
            firstName,
            lastName,
            phone,
            birthDate,
            birthPlace,
            livingCity,
            known,
            salary,
            coopWay,
            haveExperience,
            experience,
            busy,
            address,
            description,
        })
            .then(() => {
                jobSms(phone, firstName).then(() => {
                    return res.status(201).json({
                        statusCode: 201,
                        statusMessage: "Created",
                    });
                });
            })
            .catch(() => {
                return res.status(500).json({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                });
            });
    } catch {
        return res.status(500).json({
            statusCode: 500,
            statusMessage: "Internal Server Error",
        });
    }
}
module.exports = applyIt;
