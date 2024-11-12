const express = require("express");
const router = express.Router();

const {
  getProductList,
  getProduct,
  addProduct,
  updateProduct,
  archiveProduct,
} = require("../controller/product.cjs");

router.get("/", getProductList);
router.get("/:id", getProduct);
router.post("/:id", addProduct);
router.put("/:id", updateProduct);
router.patch("/:id", archiveProduct);

module.exports = router;
