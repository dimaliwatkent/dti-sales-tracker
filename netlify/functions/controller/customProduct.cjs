const CustomProduct = require("../models/customProduct.cjs");
const Business = require("../models/business.cjs");
const User = require("../models/user.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .cjson({ message: "An error occurred", err: err.message });
};

// GET /custom-product - return unarchived product
// GET /custom-product?isArchived=true
const getCustomProductList = async (req, res) => {
  try {
    const isArchived = req.query.isArchived === "true";
    const customProduct = await CustomProduct.find({ isArchived });
    if (!customProduct.length) {
      return res.status(404).cjson({ message: "No custom product found" });
    }
    return res.status(200).cjson({
      // message: 'Custom products retrieved successfully',
      customProduct,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// get customProduct by id
const getCustomProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid custom product ID" });
    }

    const customProduct = await CustomProduct.findById(id);
    if (!customProduct) {
      return res.status(404).cjson({ message: "No custom product found" });
    }
    return res.status(200).cjson({
      // message: 'Custom product retrieved successfully',
      customProduct,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// get custom products by business id
const getCustomProductByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).cjson({ message: "Invalid user ID" });
    }

    const customProducts = await CustomProduct.find({ user: userId });

    if (!customProducts.length) {
      return res
        .status(404)
        .cjson({ message: "No custom products found for this user" });
    }
    return res.status(200).cjson({
      // message: 'Custom products retrieved successfully',
      customProduct: customProducts,
    });
  } catch (err) {
    handleError(res, err);
  }
};

const addCustomProduct = async (req, res) => {
  try {
    const { userId, name, price } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).cjson({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).cjson({ message: "User not found" });
    }

    const existingProduct = await CustomProduct.findOne({ name });

    if (existingProduct) {
      return res.status(400).cjson({ message: "Product already exists" });
    }

    const customProduct = new CustomProduct({
      user: userId,
      name,
      price,
    });
    await customProduct.save();

    await User.findByIdAndUpdate(userId, {
      $push: { customProductList: customProduct._id },
    });
    return res.status(201).cjson({
      message: "Product created successfully",
      customProduct,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /custom-product/:id - update custom product
const editCustomProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, name, price } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid custom product ID" });
    }

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).cjson({ message: "Invalid user ID" });
    }

    const customProduct = await CustomProduct.findById(id);

    if (!customProduct) {
      return res.status(404).cjson({ message: "Custom product not found" });
    }
    customProduct.user = userId;
    customProduct.name = name;
    customProduct.price = price;

    await customProduct.save();
    return res.status(201).cjson({
      message: "Product updated successfully",
      customProduct,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /custom-product/:id - delete custom product
const deleteCustomProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid custom product ID" });
    }

    const customProduct = await CustomProduct.findByIdAndDelete(id);
    if (!customProduct) {
      return res.status(404).cjson({ message: "Custom product not found" });
    }
    await User.findByIdAndUpdate(customProduct.user, {
      $pull: { customProductList: id },
    });
    return res.status(200).cjson({
      message: "Product deleted successfully",
      customProduct,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Archive/Unarchive customProduct
const archiveCustomProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid custom product ID" });
    }

    const customProduct = await CustomProduct.findById(id);
    if (!customProduct) {
      return res.status(404).cjson({ message: "Product not found" });
    }

    customProduct.isArchived = isArchived;

    await customProduct.save();
    const action = isArchived ? "archived" : "unarchived";
    return res.status(200).cjson({
      message: `Product ${action} successfully`,
      customProduct: customProduct,
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getCustomProductList,
  getCustomProduct,
  getCustomProductByUser,
  addCustomProduct,
  editCustomProduct,
  deleteCustomProduct,
  archiveCustomProduct,
};
