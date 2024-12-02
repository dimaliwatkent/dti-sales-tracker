const Event = require("../models/event.cjs");
const Business = require("../models/business.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", err: err.message });
};

const updateBooth = async (req, res) => {
  try {
    const { eventId } = req.params;
    const boothList = req.body;

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const businessIds = event.businessList;

    // Set all business.booth to blank
    await Business.updateMany(
      { _id: { $in: businessIds } },
      { boothNumber: "" },
    );

    const updatedBoothList = [];

    // Loop through each booth in the request
    for (const booth of boothList) {
      // Check if the business ID is in the event's business list
      if (businessIds.includes(booth.business)) {
        try {
          // Update the business's booth
          const business = await Business.findByIdAndUpdate(
            booth.business,
            { boothNumber: booth.code },
            { new: true },
          );
          // You can handle the updated business here if needed
        } catch (err) {
          console.error(err);
        }
      }
      updatedBoothList.push(booth);
    }

    // Update the event's booth list
    event.boothList = updatedBoothList;
    await event.save();

    return res.status(200).json({ message: "Booth List Updated" });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  updateBooth,
};
