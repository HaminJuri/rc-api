const ProductModel = require("./../model/product.model");
const ShopState = require("./../model/shopStatus.model");
const CartModel = require("./../model/cart.model");
const OrderModel = require("./../model/order.model");
const UserModel = require("./../model/user.model");
const BeforePaymentDescriptionModel = require("./../model/BeforePaymentDescription.model");
const { payRequest, payVerify } = require("./../libs/pay");
const { toRial } = require("./../helpers/Functions");
const sms = require("./../libs/sms");

const INCREMENT = async (req, res) => {
    try {
        const { phone: userPhone } = req.user;
        const { productID } = req.body;
        const productDetails = await ProductModel.findById(productID).exec();
        let cart = await CartModel.findOne({ userPhone });

        if (!cart) {
            const user = await UserModel.findOne({ phone: userPhone }).exec();
            // no cart for user, create new cart
            CartModel.create({
                userPhone,
                products: [
                    {
                        productID,
                        quantity: 1,
                        name: productDetails.title,
                        serialNumber: productDetails.serialNumber,
                        productPrice: productDetails.productPrice,
                        userProfit: productDetails.userProfit || 0,
                        rcPrice: productDetails.rcPrice,
                        imageSrc: productDetails.image || "",
                        maxQuantity: productDetails.quantity === 1 ? 1 : productDetails.maxQuantity,
                    },
                ],
                destination: { receiverName: user.firstName + " " + user.lastName, receiverPhone: userPhone },
                totalPrice: productDetails.productPrice,
                totalUserProfit: productDetails.userProfit,
                totalCart: productDetails.rcPrice,
                paymentPrice: productDetails.rcPrice,
            })
                .then(async () => {
                    productDetails.quantity -= 1;
                    productDetails.markModified("quantity");
                    await productDetails.save();
                    return res.status(201).json(201);
                })
                .catch(() => {
                    return res.status(500).json({ error: err[500] });
                });
        } else if (cart) {
            // user already taken a cart
            let itemIndex = cart.products.findIndex((p) => p.productID == productID);
            if (itemIndex <= -1) {
                // product does not exists in cart, add as a new product
                cart.products.push({
                    productID,
                    quantity: 1,
                    name: productDetails.title,
                    serialNumber: productDetails.serialNumber,
                    productPrice: productDetails.productPrice,
                    rcPrice: productDetails.rcPrice,
                    userProfit: productDetails.userProfit || 0,
                    imageSrc: productDetails.image || "",
                    maxQuantity: productDetails.quantity === 1 ? 1 : productDetails.maxQuantity,
                });
                productDetails.quantity -= 1;
                productDetails.markModified("quantity");
            } else if (itemIndex > -1) {
                // product exists in the cart, update the quantity
                let cartProduct = cart.products[itemIndex]; // Check if the quantity of the added product is higher than maxQuantity
                if (productDetails.quantity > 0) {
                    cartProduct.quantity += 1;
                    cartProduct.maxQuantity = productDetails.quantity === 1 ? 1 : productDetails.maxQuantity;
                    cartProduct.serialNumber = productDetails.serialNumber;
                    cartProduct.productPrice = productDetails.productPrice;
                    cartProduct.rcPrice = productDetails.rcPrice;
                    cartProduct.userProfit = productDetails.userProfit || 0;
                    cartProduct.imageSrc = productDetails.image;
                    cart.products[itemIndex] = cartProduct;
                    productDetails.quantity -= 1;
                    productDetails.markModified("quantity");
                } else {
                    return res.status(400).json({
                        maxError: `متاسفانه حداکثر تعداد اعمال شده، برای این محصول در هر سبد خرید، ${productDetails.maxQuantity}عدد می‌باشد`,
                    });
                }
            } // Update the total price of the cart
            cart.totalPrice = cart.products.reduce(
                (total, product) => total + product.productPrice * product.quantity,
                0
            );
            cart.totalUserProfit = cart.products.reduce(
                (total, product) => total + (product.userProfit || 0) * product.quantity,
                0
            );
            cart.totalCart = cart.products.reduce(
                (total, product) => total + product.rcPrice * product.quantity,
                0
            );
            cart.paymentPrice = cart.totalCart + cart.freight;

            await cart.save();
            await productDetails.save();
            return res.status(201).json(201);
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
};

const DECREMENT = async (req, res) => {
    try {
        const { phone: userPhone } = req.user;
        const { productID } = req.body;

        let cart = await CartModel.findOne({ userPhone }).exec();

        const productDetails = await ProductModel.findById(productID).exec();
        if (!productDetails) return res.status(404).json({ error: "محصولی با این مشخصات پیدا نشد" });

        let itemIndex = cart.products.findIndex((p) => p.productID == productID);
        if (itemIndex <= -1) {
            return res.status(404).json({ error: "این محصول قبلا از سبد خرید حذف شده است" });
        }

        let cartProduct = cart.products[itemIndex];
        if (cartProduct.quantity > 1) {
            //if the cart-product's quantity is more than one, decrement it
            cartProduct.quantity -= 1;
            cartProduct.maxQuantity = productDetails.maxQuantity;
            cartProduct.serialNumber = productDetails.serialNumber;
            cartProduct.productPrice = productDetails.productPrice;
            cartProduct.rcPrice = productDetails.rcPrice;
            cartProduct.userProfit = productDetails.userProfit || 0;
            cart.products[itemIndex] = cartProduct;
        } else {
            // if the cart-product's quantity is one, remove it from the cart
            cart.products.splice(itemIndex, 1);
        }

        // Update the total price of the cart
        cart.totalPrice = cart.products.reduce(
            (total, product) => total + product.productPrice * product.quantity,
            0
        );
        cart.totalUserProfit = cart.products.reduce(
            (total, product) => total + (product.userProfit || 0) * product.quantity,
            0
        );
        cart.totalCart = cart.products.reduce(
            (total, product) => total + product.rcPrice * product.quantity,
            0
        );
        cart.paymentPrice = cart.totalCart + cart.freight;
        productDetails.quantity += 1;
        productDetails.markModified("quantity");
        await productDetails.save();

        // If there are no products left in the cart, remove the cart from the database
        if (cart.products.length === 0) {
            await CartModel.deleteOne({ userPhone });
            return res.status(200).json({ message: "سبد خرید شما با موفقیت خالی شد" });
        } else {
            await cart.save();
            return res.status(200).json(200);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserCart = async (req, res) => {
    try {
        const { phone: userPhone } = req.user;
        const user = await UserModel.findOne({ phone: userPhone }).exec();
        if (!user) return res.status(404).json({ error: err[4041] });

        const cart = await CartModel.findOne({ userPhone }).exec();
        const BeforePaymentDescription = await BeforePaymentDescriptionModel.findOne({
            is: "before-payment-description",
        });

        if (!cart) return res.status(200).json({ noCart: "سبد خرید شما خالیه" });
        return res.status(200).json({ cart, addresses: user.addresses || [], BeforePaymentDescription });
    } catch (error) {
        return res.status(500).json({ error: err[500] });
    }
};

const calcFreight = async (req, res) => {
    try {
        const { phone: userPhone } = req.user;
        const user = await UserModel.findOne({ phone: userPhone }).exec();

        const cart = await CartModel.findOne({ userPhone }).exec();
        if (!cart) return res.status(404).json({ noCart: "سبد خرید یافت نشد" });

        const { adrID } = req.params;
        if (adrID == 1234) {
            cart.freight = 0;
            cart.destination = {};
        } else {
            const adr = user.addresses.find((a) => a._id == adrID);
            if (!adr) return res.status(404).json({ error: "آدرس یافت نشد" });
            if (adr.city == "تهران") cart.freight = 75000;
            if (adr.city !== "تهران") cart.freight = 150000;
            cart.destination = adr;
        }

        cart.paymentPrice = cart.totalCart + cart.freight;

        cart.save()
            .then(() => {
                return res.status(201).json(true);
            })
            .catch(() => {
                return res
                    .status(500)
                    .json({ error: "خطایی در محاسبه کاریه رخ داد،\nلطفا دوباره تلاش کنید..." });
            });
    } catch (error) {
        return res.status(400).json({ error: err[500] });
    }
};

const requestOrder = async (req, res) => {
    try {
        const shop = await ShopState.findOne({ is: "RC" }).exec();
        if (!!shop.isOffline && process.env.NODE_ENV !== "DEV")
            return res.status(400).json({ error: "فروشگاه بسته است" });

        const { phone: userPhone } = req.user;
        const user = await UserModel.findOne({ phone: userPhone }).exec();

        const cart = await CartModel.findOne({ userPhone });
        if (!cart)
            return res.status(400).json({
                error: "سبد خرید شما منقضی شده است، لطفا دوباره اقدام به جمع آوری محصولات بکنید.",
            });

        const orderId = prd.getFullDate() + "-" + prd.getNowTime();
        const date = prd.getFullDate(true);
        const time = prd.get_time();
        payRequest({ invoiceId: orderId, amount: toRial(cart.paymentPrice), mobileNumber: userPhone })
            .then(async (response) => {
                await OrderModel.create({
                    paid: false,
                    orderId,
                    activeStep: 1,
                    totalCart: toRial(cart.totalCart),
                    totalUserProfit: toRial(cart.totalUserProfit),
                    totalPrice: toRial(cart.totalPrice),
                    freight: toRial(cart.freight),
                    paymentPrice: toRial(cart.paymentPrice),
                    paymentId: response.paymentId,
                    time: { date, time },
                    destination: cart.destination,
                    products: cart.products,
                    user: {
                        phone: userPhone,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        national: user.national,
                    },
                });
                return res.status(201).json({ redirectUrl: response.paymentUrl });
            })
            .catch((err) => {
                return res.status(400).json({ error: err.message });
            });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const verifyOrder = async (req, res) => {
    const { phone } = req.user;
    const { paymentId } = req.params;
    const ordered = await OrderModel.findOne({ paymentId }).exec();
    if (!ordered) return res.status(404).json({ errorMessage: "شماره فاکتور یافت نشد" });
    payVerify({ paymentId })
        .then(async ({ statusCode }) => {
            if (statusCode == 200) {
                try {
                    ordered.paid = true;
                    ordered.markModified("paid");
                    await ordered.save();
                    sms.orderedTemp({
                        phone,
                        firstName: ordered.user.firstName,
                        url: `https://roghanicar.com/profile/all/${ordered.orderId}`,
                    });
                    return res.status(200).json({ statusCode: 200, ordered });
                } catch {
                    return res.status(500).json({
                        message: "خطایی در ذخیره سازی سفارش شما رخ داد،\nحتما به پشتیبانی اطلاع رسانی کنید.",
                        ordered,
                    });
                }
            } else {
                return res.status(400).json({ statusCode: 500, errorMessage: "پرداخت ناموفق" });
            }
        })
        .catch((err) => {
            return res.status(200).json({ statusCode: 400, errorMessage: err?.message, ordered });
        });
};

const getOrderList = async (req, res) => {
    try {
        const { phone } = req.user;
        let { orderStatus } = req.params;
        let query = { "user.phone": phone };
        if (orderStatus != 0) query.activeStep = orderStatus;

        const order = await OrderModel.find(query).exec();
        if (!order) return res.status(404).json({ errorMessage: "⭕سفارشی برای این کاربر یافت نشد." });

        return res.status(200).json(order);
    } catch (ee) {
        return res.status(200).json({ errorMessage: err[500], ee });
    }
};
const checkout = async (req, res) => {
    try {
        const { orderId } = req.params;
        const checkout = await OrderModel.findOne({ orderId }).exec();
        if (!checkout) return res.status(404).json({ errorMessage: "⭕سفارشی با این مشخصات یافت نشد." });
        return res.status(200).json(checkout);
    } catch (ee) {
        return res.status(200).json({ errorMessage: err[500], ee });
    }
};

module.exports = {
    INCREMENT,
    DECREMENT,
    getUserCart,
    requestOrder,
    verifyOrder,
    calcFreight,
    getOrderList,
    checkout,
};
