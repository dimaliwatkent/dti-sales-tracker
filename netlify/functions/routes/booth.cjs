const express = require("express");
const router = express.Router();

const { getBooth, updateBooth } = require("../controller/booth.cjs");

router.get("/:eventId", getBooth);
router.post("/:eventId", updateBooth);

module.exports = router;
