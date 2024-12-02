const Event = require("../models/event.cjs");
const User = require("../models/user.cjs");
const mongoose = require("mongoose");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .cjson({ message: "An error occurred", err: err.message });
};

// Get all events
// GET /event - return unarchived events
// GET /event?isArchived=true
const getEventList = async (req, res) => {
  try {
    const isArchived = req.query.isArchived === "true";
    let events = await Event.find({ isArchived })
      .populate({
        path: "businessList",
        populate: {
          path: "user",
          model: "user",
        },
      })
      .populate({
        path: "applicantList",
        populate: {
          path: "user",
          model: "user",
        },
      })
      .exec();
    events = await Promise.all(
      events.map(async (event) => {
        const now = new Date();
        const applicationStart = new Date(event.applicationStart);
        const applicationEnd = new Date(event.applicationEnd);
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        if (
          !isNaN(applicationStart) &&
          !isNaN(applicationEnd) &&
          !isNaN(startDate) &&
          !isNaN(endDate)
        ) {
          if (
            now >= applicationStart &&
            now <= applicationEnd.setDate(applicationEnd.getDate() + 1)
          ) {
            event.status = "applicationOpen";
          } else if (now >= startDate && now <= endDate) {
            event.status = "ongoing";
          } else if (now < startDate) {
            event.status = "upcoming";
          } else if (now > endDate) {
            event.status = "completed";
          }
        }

        try {
          await event.save();
        } catch (err) {
          handleError(res, err);
        }
        return event;
      }),
    );

    if (!events.length) {
      return res.status(404).cjson({ message: "No events found" });
    }
    return res
      .status(200)
      .cjson({ message: "Events retrieved successfully", event: events });
  } catch (err) {
    handleError(res, err);
  }
};

const getUserEventList = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).cjson({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .populate({
        path: "businessList",
        populate: {
          path: "violationList",
          model: "businessViolation",
        },
      })
      .exec();
    if (!user) {
      return res.status(404).cjson({ message: "User not found" });
    }

    const businessList = user.businessList;

    const eventList = await Event.find().exec();
    if (!eventList) {
      return res.status(404).cjson({ message: "No event found" });
    }

    const userEventList = eventList
      .map((event) => {
        const business = businessList.find(
          (business) => business.event.toString() === event._id.toString(),
        );
        if (business) {
          return { ...event.toObject(), business };
        }
        return event;
      })
      .filter((event) => event.business);

    const openEventList = eventList.filter(
      (event) => event.status === "applicationOpen",
    );

    return res.status(200).cjson({
      message: "Event retrieved successfully",
      userEventList,
      openEventList,
    });
  } catch (err) {
    handleError(res, err);
  }
};

const getMonitorEventList = async (req, res) => {
  try {
    const eventList = await Event.find({ status: "ongoing" })
      .populate({
        path: "businessList",
        populate: {
          path: "violationList",
          model: "businessViolation",
        },
      })
      .exec();
    if (!eventList) {
      return res.status(404).cjson({ message: "No ongoing events found" });
    }

    return res.status(200).cjson({
      message: "Ongoing events retrieved successfully",
      eventList,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// get event by id
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id)
      .populate({
        path: "businessList",
        populate: {
          path: "user",
          model: "user",
        },
      })
      .populate({
        path: "applicantList",
        populate: {
          path: "user",
          model: "user",
        },
      })
      .exec();
    if (!event) {
      return res.status(404).cjson({ message: "No event found" });
    }
    return res
      .status(200)
      .cjson({ message: "Event retrieved successfully", event });
  } catch (err) {
    handleError(res, err);
  }
};

// Add event
const addEvent = async (req, res) => {
  try {
    const {
      businessList,
      title,
      location,
      logo,
      documentList,
      startDate,
      endDate,
      applicationStart,
      applicationEnd,
      booth,
    } = req.body;

    const existingEvent = await Event.findOne({ title });
    if (existingEvent) {
      return res.status(422).cjson({ message: "Event already exists" });
    }

    const newEvent = new Event({
      businessList: Array.isArray(businessList) ? businessList : [businessList],
      title,
      location,
      logo,
      documentList: Array.isArray(documentList) ? documentList : [documentList],
      startDate,
      endDate,
      applicationStart,
      applicationEnd,
      booth,
    });
    await newEvent.save();

    return res
      .status(201)
      .cjson({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    handleError(res, err);
  }
};

// Edit event
// event/:id
const editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      businessList,
      title,
      location,
      logo,
      documentList,
      startDate,
      endDate,
      applicationStart,
      applicationEnd,
      booth,
    } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).cjson({ message: "Event not found" });
    }

    event.title = title;
    event.location = location;
    event.logo = logo;
    event.documentList = Array.isArray(documentList)
      ? documentList
      : [documentList];
    event.startDate = startDate;
    event.endDate = endDate;
    event.applicationStart = applicationStart;
    event.applicationEnd = applicationEnd;
    event.booth = booth;

    await event.save();

    res.status(200).cjson({ message: "Event updated successfully", event });
  } catch (err) {
    handleError(res, err);
  }
};

// // apply for event
// const applyForEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { businessId } = req.body;
//
//     if (!id || !mongoose.isValidObjectId(id)) {
//       return res.status(400).cjson({ message: "Invalid event ID" });
//     }
//
//     if (!businessId || !mongoose.isValidObjectId(businessId)) {
//       return res.status(400).cjson({ message: "Invalid business ID" });
//     }
//
//     const event = await Event.findById(id);
//     if (!event) {
//       return res.status(404).cjson({ message: "Event not found" });
//     }
//
//     const business = await Business.findById(businessId);
//     if (!business) {
//       return res.status(404).cjson({ message: "Business not found" });
//     }
//
//     if (business.eventList.includes(event._id)) {
//       return res.status(422).cjson({ message: "Business already applied" });
//     }
//
//     if (["ongoing", "completed", "cancelled"].includes(event.status)) {
//       return res.status(422).cjson({ message: "Cannot apply to this event" });
//     }
//
//     event.applicantList.push({ business: business._id });
//     await event.save();
//
//     return res.status(200).cjson({ message: "Business applied successfully" });
//   } catch (err) {
//     handleError(res, err);
//   }
// };

// Archive/Unarchive event
const archiveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).cjson({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).cjson({ message: "Event not found" });
    }
    event.isArchived = isArchived;
    await event.save();
    const action = isArchived ? "archived" : "unarchived";

    return res
      .status(200)
      .cjson({ message: `Event ${action} successfully`, event });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getEventList,
  getUserEventList,
  getMonitorEventList,
  getEvent,
  addEvent,
  editEvent,
  archiveEvent,
};
