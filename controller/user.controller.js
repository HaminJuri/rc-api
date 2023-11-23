const sms = require("./../libs/sms");
const jwt = require("jsonwebtoken");
const UserModel = require("./../model/user.model");

const sendOtp = (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "لطفا شماره خود را وارد کنید" });

    const otp = rand.rnd(6);
    sms.verifyTemp(phone, otp)
        .then(() => {
            UserModel.findOneAndUpdate({ phone }, { otp }, { upsert: true })
                .then(() => {
                    res.status(200).json({ message: `رمز یکبار مصرف،\n به شماره ${phone} ارسال گردید.` });
                })
                .catch(() => {
                    res.status(500).json({ error: err[500] });
                });
        })
        .catch((error) => {
            return res.status(500).json({ error });
        });
};

const checkOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await UserModel.findOne({ phone, otp });
        if (!user) return res.status(404).json({ otpNotValid: "کد وارد شده اشتباه است" });

        // If user is already registered, Login
        if (!!user.auth) {
            let token;
            if (!!user.token) {
                token = user.token;
            } else if (!user.token) {
                token = jwt.sign({ phone }, process.env.JWT_KEY, { expiresIn: "10d" });
                user.token = token;
                user.markModified("token");
                await user.save();
            }

            user.otp = "";
            user.markModified("otp");
            user.save()
                .then(() => {
                    return res.status(201).json({ message: `${user.firstName} عزیز، خوش آمدید 🧡`, token });
                })
                .catch(() => {
                    return res.status(500).json({ error: err[500] });
                });
        } else {
            // If user is not registered yet, Register
            res.status(201).json({
                message: "شماره شما با موفقیت تایید شد،\nلطفا اطلاعات خود را تکمیل کنید.",
                phone,
            });
        }
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

const registerUser = async (req, res) => {
    try {
        const { phone, firstName, lastName, national, known } = req.body;
        if (!phone || !firstName || !lastName || !national || !known)
            return res.status(400).json({ error: "مقادیر لازم جهت ثبت نام تکمیل نشده است" });

        const token = jwt.sign({ phone }, process.env.JWT_KEY, { expiresIn: "10d" });
        await UserModel.findOneAndUpdate(
            { phone },
            { firstName, lastName, national, known, phone, auth: true },
            { upsert: true }
        );

        return res.status(201).json({ message: `${firstName} عزیز، خوش آمدید 🧡`, token });
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

const checkAuthByJWT = async (req, res) => {
    try {
        const { phone } = req.user;
        const user = await UserModel.findOne({ phone }).exec();
        if (user && !!user.auth) return res.status(200).json(true);
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

const getUserInfo = async (req, res) => {
    const { phone } = req.user;
    const user = await UserModel.findOne({ phone })
        .select("phone firstName lastName national known landlinePhone credit birthday")
        .exec();
    if (!user) return res.status(404).json({ error: "کاربری با این مشخصات ثبت نام نکرده است" });
    return res.status(200).json({ user });
};

const updateUserInfo = async (req, res) => {
    try {
        const { phone } = req.user;
        const { firstName, lastName, national, landlinePhone, credit, birthday } = req.body;

        if (!firstName || !lastName || !national)
            return res.status(400).json({ error: "موارد ستاره‌دار (*) الزامیست" });

        const user = await UserModel.findOneAndUpdate(
            { phone },
            { firstName, lastName, national, landlinePhone, credit, birthday, auth: true },
            { upsert: true }
        );
        if (!user) return res.status(404).json({ error: "کاربری با این مشخصات ثبت نام نکرده است" });

        return res.status(201).json({ message: "مشخصات شما با موفقیت بروزرسانی شد" });
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

const addNewAddress = async (req, res) => {
    try {
        const { phone } = req.user;
        const { title, province, city, postal, receiverName, receiverPhone, address } = req.body;

        const user = await UserModel.findOneAndUpdate(
            { phone },
            {
                $push: {
                    addresses: {
                        title,
                        province,
                        city,
                        postal,
                        receiverName,
                        receiverPhone,
                        address,
                    },
                },
            },
            { new: true }
        );

        const newAddress = user.addresses[user.addresses.length - 1];
        return res
            .status(200)
            .json({ message: "آدرس با موفقیت به حساب شما افزوده شد", addedAddress: { id: newAddress._id } });
    } catch {
        return res.status(500).json({ error: "خطایی در افزودن آدرس رخ داد، لطفا دوباره تلاش کنید" });
    }
};

const removeUserAddressByID = async (req, res) => {
    try {
        const { phone } = req.user;
        const { addressID } = req.params;

        UserModel.findOneAndUpdate({ phone }, { $pull: { addresses: { _id: addressID } } })
            .then(() => {
                return res.status(200).json(true);
            })
            .catch(() => {
                return res
                    .status(500)
                    .json({ error: "خطایی در حذف آدرس از سامانه رخ داد، لطفا دوباره تلاش کنید" });
            });
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

module.exports = {
    sendOtp,
    checkOtp,
    registerUser,
    checkAuthByJWT,
    getUserInfo,
    updateUserInfo,
    addNewAddress,
    removeUserAddressByID,
};
