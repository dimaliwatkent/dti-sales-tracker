const express = require("express");
const router = express.Router();

const { updateBooth } = require("../controller/booth.cjs");

router.post("/:eventId", updateBooth);

module.exports = router;
