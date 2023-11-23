const axios = require("axios").default;

const payRequest = ({ invoiceId, mobileNumber, amount }) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "POST",
            url: "https://payment.payfa.com/v2/api/Transaction/Request",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.PAY_API_KEY,
            },
            data: {
                callbackUrl: "http://localhost:3000/payment/verify",
                amount,
                invoiceId,
                mobileNumber,
                cardNumber: null,
            },
        };
        axios(options)
            .then((response) => {
                const { data } = response || {};
                return resolve(data);
            })
            .catch((error) => {
                const { data } = error.response || {};
                return reject(data);
            });
    });
};

const payVerify = ({ paymentId }) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "POST",
            url: `https://payment.payfa.com/v2/api/Transaction/Verify/${paymentId}`,
            headers: { "Content-Type": "application/json", "X-API-Key": process.env.PAY_API_KEY },
        };
        axios(options)
            .then((response) => {
                const { data } = response || {};
                return resolve(data);
            })
            .catch((error) => {
                const { data } = error.response || {};
                return reject(data);
            });
    });
};

module.exports = { payRequest, payVerify };
