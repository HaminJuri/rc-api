const rp = require("request-promise");

function setPayment(amount, mobile) {
    return new Promise(async (resolve, reject) => {
        let params = {
            merchant_id: "9d7e537c-514f-4210-8777-da95aeab6e49",
            amount,
            callback_url: "http://localhost:3002/payment/checker",
            description: "تست: خرید محصول",
            mobile,
        };
        let options = {
            method: "POST",
            uri: "https://api.zarinpal.com/pg/v4/payment/request.json",
            headers: {
                "cache-control": "no-cache",
                "content-type": "application/json",
            },
            body: params,
            json: true,
        };
        rp(options)
            .then((data) => {
                return resolve(data);
            })
            .catch((e) => {
                return reject(e);
            });
    });
}
module.exports = setPayment;
