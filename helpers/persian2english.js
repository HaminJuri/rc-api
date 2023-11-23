function persianNum2english(persianNum) {
    return persianNum.replace(/[۰-۹]/g, function (d) {
        return "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
    });
}

module.exports = persianNum2english;
