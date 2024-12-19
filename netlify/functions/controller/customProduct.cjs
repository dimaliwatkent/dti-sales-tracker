const CustomProduct = require("../models/customProduct.cjs");
const User = require("../models/user.cjs");
const mongoose = require("mongoose");

// GET /custom-product - return unarchived product
// GET /custom-product?isArchived=true
const getCustomProductList = async (req, res, next) => {
  try {
    const isArchived = req.query.isArchived === "true";
    const customProduct = await CustomProduct.find({ isArchived });
    if (!customProduct.length) {
      return res.status(404).json({ message: "No custom product found" });
    }
    return res.status(200).json({
      // message: 'Custom products retrieved successfully',
      customProduct,
    });
  } catch (error) {
    next(error);
  }
};

// get customProduct by id
const getCustomProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid custom product ID" });
    }

    const customProduct = await CustomProduct.findById(id);
    if (!customProduct) {
      return res.status(404).json({ message: "No custom product found" });
    }
    return res.status(200).json({
      // message: 'Custom product retrieved successfully',
      customProduct,
    });
  } catch (error) {
    next(error);
  }
};

// get custom products by business id
const getCustomProductByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const customProducts = await CustomProduct.find({ user: userId });

    if (!customProducts.length) {
      return res
        .status(404)
        .json({ message: "No custom products found for this user" });
    }
    return res.status(200).json({
      // message: 'Custom products retrieved successfully',
      customProduct: customProducts,
    });
  } catch (error) {
    next(error);
  }
};

const addCustomProduct = async (req, res, next) => {
  try {
    const { eventId, userId } = req.params;
    const productList = req.body.productList;

    // Delete all products that match the event and user
    await CustomProduct.deleteMany({ event: eventId, user: userId });

    // Add all the content of the product list to CustomProduct
    const customProducts = productList.map((product) => ({
      user: product.user,
      event: product.event,
      name: product.name,
      price: product.price,
    }));

    const customProduct = await CustomProduct.insertMany(customProducts);

    return res.status(201).json({
      message: "Products updated successfully",
      customProduct,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /custom-product/:id - update custom product
const editCustomProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, name, price } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid custom product ID" });
    }

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const customProduct = await CustomProduct.findById(id);

    if (!customProduct) {
      return res.status(404).json({ message: "Custom product not found" });
    }
    customProduct.user = userId;
    customProduct.name = name;
    customProduct.price = price;

    await customProduct.save();
    return res.status(201).json({
      message: "Product updated successfully",
      customProduct,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /custom-product/:id - delete custom product
const deleteCustomProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid custom product ID" });
    }

    const customProduct = await CustomProduct.findByIdAndDelete(id);
    if (!customProduct) {
      return res.status(404).json({ message: "Custom product not found" });
    }
    await User.findByIdAndUpdate(customProduct.user, {
      $pull: { customProductList: id },
    });
    return res.status(200).json({
      message: "Product deleted successfully",
      customProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Archive/Unarchive customProduct
const archiveCustomProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid custom product ID" });
    }

    const customProduct = await CustomProduct.findById(id);
    if (!customProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    customProduct.isArchived = isArchived;

    await customProduct.save();
    const action = isArchived ? "archived" : "unarchived";
    return res.status(200).json({
      message: `Product ${action} successfully`,
      customProduct: customProduct,
    });
  } catch (error) {
    next(error);
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
