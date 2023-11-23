const replacePackagingType = (num) => {
    switch (num) {
        case 1: {
            return "پلاستیکی";
        }
        case 2: {
            return "فلزی";
        }
        case 3: {
            return "کوارت";
        }
        case 4: {
            return "گالن";
        }
        case 5: {
            return "سطل";
        }
        default: {
            return "";
        }
    }
};

const replaceProductType = (num) => {
    switch (num) {
        case 1001: {
            return "روغن موتور";
        }
        case 1002: {
            return "روغن گیربکس";
        }
        case 1003: {
            return "روغن ترمز";
        }
        case 1004: {
            return "روغن هیدرولیک";
        }
        case 1005: {
            return "مکمل سوخت";
        }
        case 1006: {
            return "ضد یخ و آب رادیاتور";
        }
        case 1007: {
            return "گریس و سایر روان کننده‌ها";
        }
        case 1008: {
            return "فیلتر هوا";
        }
        case 1009: {
            return "فیلتر سوخت";
        }
        case 1010: {
            return "فیلتر روغن";
        }
        case 1011: {
            return "فیلتر هوای کابین";
        }

        default: {
            return "";
        }
    }
};

module.exports = { replacePackagingType, replaceProductType };
