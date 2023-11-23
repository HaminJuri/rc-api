const ProductModel = require("./../model/product.model");
const ShopState = require("./../model/shopStatus.model");
const CarsModel = require("./../model/car.model");
const CategoryModel = require("./../model/category.model");
const BrandModel = require("./../model/brand.model");

const handleSpecialCharacter = (wordString) => {
    let wordsArray = wordString.split(" ");
    wordsArray = wordsArray.map((word) => (word.endsWith("ه") ? word.substring(0, word.length - 1) : word));
    return wordsArray.join(" ");
};

const convertToArrayOfWords = (string, type) => {
    const processedString = handleSpecialCharacter(string.replace(/\s\s+/g, " "));
    if (type === "remaining") {
        return processedString;
    }
    return processedString.split(" ");
};

const containsAllWords = (source, target) => {
    return target.every((word) => source.includes(word));
};

const getAllProducts = async (req, res) => {
    let { page = 1, limit = 40, sortBy = 5, search, categories, brands } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    categories = categories ? categories.split(",") : [];
    brands = brands ? brands.split(",") : [];

    let cars = [];
    let remaining;

    const listOfCars = await CarsModel.find().exec();
    const listOfCategories = await CategoryModel.find().exec();
    const listOfBrands = await BrandModel.find().exec();

    if (!!search) {
        let searchWordsArray = convertToArrayOfWords(search.trim());
        // Searching in categories
        if (!categories.length) {
            listOfCategories.forEach((item) => {
                const valueWordsArray = convertToArrayOfWords(item.value);
                const field1WordsArray = convertToArrayOfWords(item.field1 || "");
                const field2WordsArray = convertToArrayOfWords(item.field2 || "");
                const field3WordsArray = convertToArrayOfWords(item.field3 || "");
                const field4WordsArray = convertToArrayOfWords(item.field4 || "");
                const field5WordsArray = convertToArrayOfWords(item.field5 || "");
                const field6WordsArray = convertToArrayOfWords(item.field6 || "");
                const field7WordsArray = convertToArrayOfWords(item.field7 || "");
                const field8WordsArray = convertToArrayOfWords(item.field8 || "");
                const field9WordsArray = convertToArrayOfWords(item.field9 || "");
                const field10WordsArray = convertToArrayOfWords(item.field10 || "");

                if (
                    containsAllWords(searchWordsArray, valueWordsArray) ||
                    containsAllWords(searchWordsArray, field1WordsArray) ||
                    containsAllWords(searchWordsArray, field2WordsArray) ||
                    containsAllWords(searchWordsArray, field3WordsArray) ||
                    containsAllWords(searchWordsArray, field4WordsArray) ||
                    containsAllWords(searchWordsArray, field5WordsArray) ||
                    containsAllWords(searchWordsArray, field6WordsArray) ||
                    containsAllWords(searchWordsArray, field7WordsArray) ||
                    containsAllWords(searchWordsArray, field8WordsArray) ||
                    containsAllWords(searchWordsArray, field9WordsArray) ||
                    containsAllWords(searchWordsArray, field10WordsArray)
                ) {
                    categories.push(item.value);
                }
            });
        }

        // Searching in brands
        if (!brands.length) {
            listOfBrands.forEach((item) => {
                const valueWordsArray = convertToArrayOfWords(item.value);
                const field1WordsArray = convertToArrayOfWords(item.field1 || "");
                const field2WordsArray = convertToArrayOfWords(item.field2 || "");
                const field3WordsArray = convertToArrayOfWords(item.field3 || "");
                const field4WordsArray = convertToArrayOfWords(item.field4 || "");
                const field5WordsArray = convertToArrayOfWords(item.field5 || "");
                const field6WordsArray = convertToArrayOfWords(item.field6 || "");
                const field7WordsArray = convertToArrayOfWords(item.field7 || "");
                const field8WordsArray = convertToArrayOfWords(item.field8 || "");
                const field9WordsArray = convertToArrayOfWords(item.field9 || "");
                const field10WordsArray = convertToArrayOfWords(item.field10 || "");

                if (
                    containsAllWords(searchWordsArray, valueWordsArray) ||
                    containsAllWords(searchWordsArray, field1WordsArray) ||
                    containsAllWords(searchWordsArray, field2WordsArray) ||
                    containsAllWords(searchWordsArray, field3WordsArray) ||
                    containsAllWords(searchWordsArray, field4WordsArray) ||
                    containsAllWords(searchWordsArray, field5WordsArray) ||
                    containsAllWords(searchWordsArray, field6WordsArray) ||
                    containsAllWords(searchWordsArray, field7WordsArray) ||
                    containsAllWords(searchWordsArray, field8WordsArray) ||
                    containsAllWords(searchWordsArray, field9WordsArray) ||
                    containsAllWords(searchWordsArray, field10WordsArray)
                ) {
                    brands.push(item.value);
                }
            });
        }
        listOfCars.forEach((item) => {
            const valueWordsArray = convertToArrayOfWords(item.value);
            const field1WordsArray = convertToArrayOfWords(item.field1 || "");
            const field2WordsArray = convertToArrayOfWords(item.field2 || "");
            const field3WordsArray = convertToArrayOfWords(item.field3 || "");
            const field4WordsArray = convertToArrayOfWords(item.field4 || "");
            const field5WordsArray = convertToArrayOfWords(item.field5 || "");
            const field6WordsArray = convertToArrayOfWords(item.field6 || "");
            const field7WordsArray = convertToArrayOfWords(item.field7 || "");
            const field8WordsArray = convertToArrayOfWords(item.field8 || "");
            const field9WordsArray = convertToArrayOfWords(item.field9 || "");
            const field10WordsArray = convertToArrayOfWords(item.field10 || "");

            if (
                containsAllWords(searchWordsArray, valueWordsArray) ||
                containsAllWords(searchWordsArray, field1WordsArray) ||
                containsAllWords(searchWordsArray, field2WordsArray) ||
                containsAllWords(searchWordsArray, field3WordsArray) ||
                containsAllWords(searchWordsArray, field4WordsArray) ||
                containsAllWords(searchWordsArray, field5WordsArray) ||
                containsAllWords(searchWordsArray, field6WordsArray) ||
                containsAllWords(searchWordsArray, field7WordsArray) ||
                containsAllWords(searchWordsArray, field8WordsArray) ||
                containsAllWords(searchWordsArray, field9WordsArray) ||
                containsAllWords(searchWordsArray, field10WordsArray)
            ) {
                cars.push(item.value);
            }
        });

        // Iterate over the searchWordsArray
        let remainingTerms = [];
        for (let searchWord of searchWordsArray) {
            let foundInCategories = listOfCategories.some((item) => {
                const valueWordsArray = convertToArrayOfWords(item.value);
                const field1WordsArray = convertToArrayOfWords(item.field1 || "");
                const field2WordsArray = convertToArrayOfWords(item.field2 || "");
                const field3WordsArray = convertToArrayOfWords(item.field3 || "");
                const field4WordsArray = convertToArrayOfWords(item.field4 || "");
                const field5WordsArray = convertToArrayOfWords(item.field5 || "");
                const field6WordsArray = convertToArrayOfWords(item.field6 || "");
                const field7WordsArray = convertToArrayOfWords(item.field7 || "");
                const field8WordsArray = convertToArrayOfWords(item.field8 || "");
                const field9WordsArray = convertToArrayOfWords(item.field9 || "");
                const field10WordsArray = convertToArrayOfWords(item.field10 || "");

                return (
                    valueWordsArray.includes(searchWord) ||
                    field1WordsArray.includes(searchWord) ||
                    field2WordsArray.includes(searchWord) ||
                    field3WordsArray.includes(searchWord) ||
                    field4WordsArray.includes(searchWord) ||
                    field5WordsArray.includes(searchWord) ||
                    field6WordsArray.includes(searchWord) ||
                    field7WordsArray.includes(searchWord) ||
                    field8WordsArray.includes(searchWord) ||
                    field9WordsArray.includes(searchWord) ||
                    field10WordsArray.includes(searchWord)
                );
            });

            let foundInBrands = listOfBrands.some((item) => {
                const valueWordsArray = convertToArrayOfWords(item.value);
                const field1WordsArray = convertToArrayOfWords(item.field1 || "");
                const field2WordsArray = convertToArrayOfWords(item.field2 || "");
                const field3WordsArray = convertToArrayOfWords(item.field3 || "");
                const field4WordsArray = convertToArrayOfWords(item.field4 || "");
                const field5WordsArray = convertToArrayOfWords(item.field5 || "");
                const field6WordsArray = convertToArrayOfWords(item.field6 || "");
                const field7WordsArray = convertToArrayOfWords(item.field7 || "");
                const field8WordsArray = convertToArrayOfWords(item.field8 || "");
                const field9WordsArray = convertToArrayOfWords(item.field9 || "");
                const field10WordsArray = convertToArrayOfWords(item.field10 || "");

                return (
                    valueWordsArray.includes(searchWord) ||
                    field1WordsArray.includes(searchWord) ||
                    field2WordsArray.includes(searchWord) ||
                    field3WordsArray.includes(searchWord) ||
                    field4WordsArray.includes(searchWord) ||
                    field5WordsArray.includes(searchWord) ||
                    field6WordsArray.includes(searchWord) ||
                    field7WordsArray.includes(searchWord) ||
                    field8WordsArray.includes(searchWord) ||
                    field9WordsArray.includes(searchWord) ||
                    field10WordsArray.includes(searchWord)
                );
            });

            let foundInCars = listOfCars.some((item) => {
                const valueWordsArray = convertToArrayOfWords(item.value);
                const field1WordsArray = convertToArrayOfWords(item.field1 || "");
                const field2WordsArray = convertToArrayOfWords(item.field2 || "");
                const field3WordsArray = convertToArrayOfWords(item.field3 || "");
                const field4WordsArray = convertToArrayOfWords(item.field4 || "");
                const field5WordsArray = convertToArrayOfWords(item.field5 || "");
                const field6WordsArray = convertToArrayOfWords(item.field6 || "");
                const field7WordsArray = convertToArrayOfWords(item.field7 || "");
                const field8WordsArray = convertToArrayOfWords(item.field8 || "");
                const field9WordsArray = convertToArrayOfWords(item.field9 || "");
                const field10WordsArray = convertToArrayOfWords(item.field10 || "");

                return (
                    valueWordsArray.includes(searchWord) ||
                    field1WordsArray.includes(searchWord) ||
                    field2WordsArray.includes(searchWord) ||
                    field3WordsArray.includes(searchWord) ||
                    field4WordsArray.includes(searchWord) ||
                    field5WordsArray.includes(searchWord) ||
                    field6WordsArray.includes(searchWord) ||
                    field7WordsArray.includes(searchWord) ||
                    field8WordsArray.includes(searchWord) ||
                    field9WordsArray.includes(searchWord) ||
                    field10WordsArray.includes(searchWord)
                );
            });

            // If the search term is not found in either categories or brands, add it to remainingTerms
            if (!foundInCategories && !foundInBrands && !foundInCars) {
                remainingTerms.push(searchWord);
            }
        }

        // Set the remainingSearchTerms state with the remaining terms
        remaining = remainingTerms.join(",");
        remaining = p2eNum(remaining);
        remaining = remaining.split(",");
    }

    const findCategory = (cat) => {
        switch (cat) {
            case "1000": {
                return { $regex: "^1", $options: "i" };
            }
            case "2000": {
                return { $regex: "^2", $options: "i" };
            }
            case "3000": {
                return { $regex: "^3", $options: "i" };
            }
            default: {
                return cat;
            }
        }
    };

    const buildFilter = (cars, brands, categories) => {
        const filter = {};
        if (cars && cars.length > 0) filter.cars = { $in: cars };
        if (brands && brands.length > 0) filter.brand = brands.length > 1 ? { $in: brands } : brands[0];
        if (categories && categories.length > 0)
            filter.category = categories.length > 1 ? { $in: categories } : findCategory(categories[0]);
        if (remaining) filter.search = { $in: remaining.map((value) => new RegExp(`${value}`, "i")) };
        return filter;
    };

    const buildFilterForSuggest = (cars, brands, categories) => {
        let filter = {};
        if (
            (cars.length && !brands.length && !categories.length) ||
            (!cars.length && brands.length && !categories.length) ||
            (!cars.length && !brands.length && categories.length)
        ) {
            filter = { _id: null };
        } else if (cars.length && brands.length) {
            filter = {
                cars: { $in: cars },
                brand: brands.length > 1 ? { $nin: brands } : { $ne: brands[0] },
            };
        } else if (cars.length && categories.length) {
            filter = {
                cars: { $in: cars },
                category: categories.length > 1 ? { $nin: categories } : { $ne: categories[0] },
            };
        } else if (brands.length && categories.length) {
            filter = {
                category: categories.length > 1 ? { $in: categories } : categories[0],
                brand: brands.length > 1 ? { $nin: brands } : { $ne: brands[0] },
            };
        } else if (cars.length && categories.length && brands.length) {
            filter = {
                cars: { $in: cars },
                category: categories.length > 1 ? { $in: categories } : categories[0],
                brand: brands.length > 1 ? { $nin: brands } : { $ne: brands[0] },
            };
        }
        return filter;
    };

    const getSortObject = (sort) => {
        switch (+sort) {
            case 1: {
                return { suggestion: 1 };
            }
            case 2: {
                return { sales: -1 };
            }
            case 3: {
                return { price: -1 };
            }
            case 4: {
                return { price: 1 };
            }
            case 5: {
                return {};
            }
        }
    };

    const filters = { ...buildFilter(cars, brands, categories), quantity: { $gt: 0 } };
    const filtersSuggested = { ...buildFilterForSuggest(cars, brands, categories), quantity: { $gt: 0 } };
    const filtersUnAvailable = { ...buildFilter(cars, brands, categories), quantity: { $lte: 0 } };

    const options = {
        limit,
        select: "title serialNumber rcPrice discount discountedPrice category image quantity tags",
        sort: { quantity: 1, ...getSortObject(sortBy) },
    };

    try {
        let availableProducts = [];
        availableProducts = await ProductModel.find(filters)
            .select(options.select)
            .sort(options.sort)
            .limit(options.limit)
            .skip((page - 1) * options.limit)
            .exec();
        options.limit = Math.max(0, limit - availableProducts.length);

        let suggestionProducts = [];
        if (options.limit > 0) {
            suggestionProducts = await ProductModel.find(filtersSuggested)
                .select(options.select)
                .sort(options.sort)
                .limit(options.limit)
                .skip((page - 1) * options.limit)
                .exec();

            options.limit = Math.max(0, options.limit - suggestionProducts.length);
        }

        let unAvailableProducts = [];
        if (options.limit > 0) {
            unAvailableProducts = await ProductModel.find(filtersUnAvailable)
                .select(options.select)
                .sort(options.sort)
                .limit(options.limit)
                .skip((page - 1) * options.limit)
                .exec();
        }
        let docs = [...availableProducts, ...suggestionProducts, ...unAvailableProducts];

        const products = { docs };

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: err[500], e: error });
    }
};

const getProduct = async (req, res) => {
    try {
        const { serialNumber } = req.params;
        const product = await ProductModel.findOne({ serialNumber });
        if (!product) {
            return res.status(404).json({ error: err[4041] });
        }
        product.views += 1;
        await product.save();

        const { isOffline, description } = await ShopState.findOne({ is: "RC" });

        return res.status(200).json({ product, shopState: { isOffline, description } });
    } catch {
        return res.status(500).json({ error: err[500] });
    }
};

module.exports = { getAllProducts, getProduct };
