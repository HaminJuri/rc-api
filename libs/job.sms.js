const axios = require("axios");

function TempSms(phone, firstName) {
    return new Promise(async (resolve, reject) => {
        const data = JSON.stringify({
            mobile: phone,
            templateId: 333909,
            parameters: [{ name: "FIRSTNAME", value: firstName }],
        });

        const config = {
            method: "post",
            url: "https://api.sms.ir/v1/send/verify",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/plain",
                "x-api-key": process.env.SMS_API_KEY,
            },
            data,
        };
        axios(config)
            .then((r) => {
                if (r.data.status === 1) {
                    return resolve(true);
                } else {
                    return reject("درخواست با موفقیت ارسال نشد، لطفا دوباره امتحان کنید");
                }
            })
            .catch(() => {
                return reject("درخواست با موفقیت ارسال نشد، لطفا دوباره امتحان کنید");
            });
    });
}
module.exports = TempSms;
