const Event = require("../models/event.cjs");
const Business = require("../models/business.cjs");
const mongoose = require("mongoose");

const getBooth = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId)
      .select("title _id boothList")
      .populate({
        path: "businessList",
        select: "_id name",
      })
      .exec();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    next(error);
  }
};

const updateBooth = async (req, res, next) => {
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

    for (const booth of boothList) {
      if (businessIds.includes(booth.business)) {
        try {
          const business = await Business.findByIdAndUpdate(
            booth.business,
            { boothNumber: booth.code },
            { new: true },
          );
        } catch (error) {
          console.error(error);
        }
      }
      updatedBoothList.push(booth);
    }

    // Update the event's booth list
    event.boothList = updatedBoothList;
    await event.save();

    return res.status(200).json({ message: "Booth List Updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooth,
  updateBooth,
};
