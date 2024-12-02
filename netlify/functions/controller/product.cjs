const Product = require("../models/product.cjs");
const Business = require("../models/business.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .cjson({ message: "An error occurred", err: err.message });
};

// get
const getProductList = async (req, res) => {
  try {
    const isArchived = req.query.isArchived === "true";
    const product = await Product.find({ isArchived });

    if (!product.length) {
      return res.status(404).cjson({ message: "No product found" });
    }
    return res
      .status(200)
      .cjson({ message: "Product list retrieved successfully", product });
  } catch (err) {
    handleError(res, err);
  }
};

// get by id
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid award ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).cjson({ message: "No product found" });
    }
    return res
      .status(200)
      .cjson({ message: "Product retrieved successfully", product });
  } catch (err) {
    handleError(res, err);
  }
};

// add
const addProduct = async (req, res) => {
  try {
    // business id is required
    const { id } = req.params;
    const { productName, productPrice } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid product ID" });
    }

    const existingProduct = await Product.findOne({ productName });
    const existingBusiness = await Business.findById(id);

    if (existingProduct) {
      return res.status(409).cjson({ message: "Product already exists" });
    }

    if (!existingBusiness) {
      return res.status(404).cjson({ message: "Business not found" });
    }

    const newProduct = new Product({
      productName,
      productPrice,
    });

    await newProduct.save();

    const session = await mongoose.startSession();
    session.startTransaction();
    existingBusiness.products.push(newProduct._id);
    newProduct.business = existingBusiness._id;
    await existingBusiness.save({ session });
    await session.commitTransaction();

    return res
      .status(201)
      .cjson({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    handleError(res, err);
  }
};
// update
const updateProduct = async (req, res) => {
  try {
    // product id is required
    const { id } = req.params;
    const { productName, productPrice } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid product ID" });
    }

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).cjson({ message: "Product not found" });
    }

    existingProduct.productName = productName;
    existingProduct.productPrice = productPrice;
    await existingProduct.save();

    return res.status(200).cjson({
      message: "Product updated successfully",
      product: existingProduct,
    });
  } catch (err) {
    handleError(res, err);
  }
};
// archive
const archiveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid product ID" });
    }

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).cjson({ message: "Product not found" });
    }

    existingProduct.isArchived = isArchived;
    await existingProduct.save();

    const action = isArchived ? "archived" : "unarchived";

    return res.status(200).cjson({
      message: `Product ${action} successfully`,
      product: existingProduct,
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getProductList,
  getProduct,
  addProduct,
  updateProduct,
  archiveProduct,
};
