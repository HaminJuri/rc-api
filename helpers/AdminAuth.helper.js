const AdminAuthModel = require("../model/admin/AdminAuth.model");
const Admins = require("./../model/admin/AdminUser.model");

function ck(req) {
    return new Promise(async (resolve, reject) => {
        let { uuid } = req.headers;
        if (!uuid) return reject("⛔ کلید دسترسی پیدا نشد");

        let d = await AdminAuthModel.findOne({ uuid }).exec();
        if (!d) return reject("⛔ کلید دسترسی معتبر نیست");

        Admins.findOne({ userName: d.userName })
            .then((admin) => {
                return resolve({
                    userName: admin.userName,
                    type: admin.type,
                });
            })
            .catch((error) => {
                return reject(`an error accord, please try again, ${error}`);
            });
    });
}

module.exports = ck;
