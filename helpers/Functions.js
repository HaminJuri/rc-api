const copyObject = (object) => {
    return JSON.parse(JSON.stringify(object));
};

const toRial = (amount) => {
    return +amount * 10;
};

module.exports.copyObject = copyObject;
module.exports.toRial = toRial;
