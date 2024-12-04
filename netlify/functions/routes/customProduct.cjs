const express = require("express");
const router = express.Router();

const {
  getCustomProductList,
  getCustomProduct,
  addCustomProduct,
  getCustomProductByUser,
  editCustomProduct,
  deleteCustomProduct,
  archiveCustomProduct,
} = require("../controller/customProduct.cjs");

router.get("/", getCustomProductList);
router.get("/:id", getCustomProduct);
router.get("/user/:userId", getCustomProductByUser);
router.post("/:eventId/:userId", addCustomProduct);
router.put("/:id", editCustomProduct);
router.delete("/:id", deleteCustomProduct);
router.patch("/:id", archiveCustomProduct);

module.exports = router;
