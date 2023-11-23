const Kavenegar = require("kavenegar");

let api = Kavenegar.KavenegarApi({
    apikey: process.env.SMS_API_KEY,
});

const verifyTemp = (phone, otp) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            receptor: phone,
            token: otp,
            template: "verify",
        };
        api.VerifyLookup(data, function (response, status) {
            if (status === 200) {
                return resolve(true);
            } else {
                return reject("کد با موفقیت ارسال نشد،\nلطفا دوباره امتحان کنید.");
            }
        });
    });
};

const orderedTemp = ({ phone, firstName, url }) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            receptor: phone,
            token: firstName,
            token2: url,
            template: "ordered",
        };
        api.VerifyLookup(data, function (response, status) {
            if (status === 200) {
                return resolve(true);
            } else {
                return reject("کد با موفقیت ارسال نشد،\nلطفا دوباره امتحان کنید.");
            }
        });
    });
};

module.exports = { verifyTemp, orderedTemp };
