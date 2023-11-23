module.exports = function delayIt(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
