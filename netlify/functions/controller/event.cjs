const User = require("../models/user.cjs");
const Event = require("../models/event.cjs");
const Sale = require("../models/sale.cjs");
const mongoose = require("mongoose");
const { addEventSchema } = require("../zod/eventSchema.cjs");

// status "applicationOpen", "upcoming", "ongoing", "completed", "cancelled", "postponed",
const getEventByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;

    if (!status) {
      return res.status(400).send({ message: "Status is required" });
    }

    let events;
    if (status.toLowerCase() === "all") {
      events = await Event.find()
        .select("title _id startDate endDate status")
        .exec();
    } else {
      events = await Event.find({ status })
        .select("title _id startDate endDate status")
        .exec();
    }

    if (!events || events.length === 0) {
      return res.status(404).send({ message: "No events found" });
    }

    return res
      .status(200)
      .json({ message: "Events retrieved successfully", eventList: events });
  } catch (error) {
    next(error);
  }
};

const getEventWithBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id)
      .populate({
        path: "businessList",
        select: "_id name",
      })
      .populate({ path: "applicantList", select: "applicationStatus" });

    if (!event) {
      return res.status(404).json({ message: "No event found" });
    }

    const totalSales = await Sale.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const businessListWithTotalSales = await Promise.all(
      event.businessList.map(async (business) => {
        const totalSales = await Sale.aggregate([
          {
            $match: {
              business: new mongoose.Types.ObjectId(business._id),
              event: new mongoose.Types.ObjectId(id),
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$totalAmount" },
            },
          },
        ]);
        return {
          _id: business._id,
          name: business.name,
          totalSales: totalSales[0] ? totalSales[0].totalSales : 0,
        };
      }),
    );

    // for getting business count
    const rejectedList = event.applicantList.filter(
      (business) => business.applicationStatus.toLowerCase() === "rejected",
    );
    const applicantList = event.applicantList.filter((business) =>
      ["forcompletion", "pending", "complied"].includes(
        business.applicationStatus.toLowerCase(),
      ),
    );

    const eventData = {
      _id: event._id,
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      totalEventSales: totalSales[0] ? totalSales[0].totalSales : 0,
      businessList: businessListWithTotalSales,
      businessCount: {
        applicant: applicantList.length,
        rejected: rejectedList.length,
      },
    };

    return res
      .status(200)
      .json({ message: "Events retrieved successfully", event: eventData });
  } catch (error) {
    next(error);
  }
};

// Get all events
// GET /event - return unarchived events
// GET /event?isArchived=true
const getEventList = async (req, res, next) => {
  try {
    const isArchived = req.query.isArchived === "true";
    let events = await Event.find({ isArchived }).exec();
    events = await Promise.all(
      events.map(async (event) => {
        const now = new Date(
          new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }),
        );
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
      return res.status(404).json({ message: "No events found" });
    }
    return res
      .status(200)
      .json({ message: "Events retrieved successfully", eventList: events });
  } catch (error) {
    next(error);
  }
};

const getEventPopulated = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
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
      return res.status(404).json({ message: "No event found" });
    }
    return res
      .status(200)
      .json({ message: "Event retrieved successfully", event });
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id).exec();
    if (!event) {
      return res.status(404).json({ message: "No event found" });
    }
    return res
      .status(200)
      .json({ message: "Event retrieved successfully", event });
  } catch (error) {
    next(error);
  }
};

const getUserEventList = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
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
      return res.status(404).json({ message: "User not found" });
    }

    const businessList = user.businessList;

    const eventList = await Event.find().exec();
    if (!eventList) {
      return res.status(404).json({ message: "No event found" });
    }

    const userEventList = eventList
      .map((event) => {
        const business = businessList?.find(
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

    return res.status(200).json({
      message: "Event retrieved successfully",
      userEventList,
      openEventList,
    });
  } catch (error) {
    next(error);
  }
};

// Add event
const addEvent = async (req, res, next) => {
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
      isLocal,
      boothList,
    } = req.body;

    const parsedBody = addEventSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(422).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues,
      });
    }

    const existingEvent = await Event.findOne({ title });
    if (existingEvent) {
      return res.status(422).json({ message: "Event already exists" });
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
      isLocal,
      boothList,
    });
    await newEvent.save();

    return res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    next(error);
  }
};

// Edit event
// event/:id
const editEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      businessList,
      applicantList,
      title,
      location,
      logo,
      documentList,
      startDate,
      endDate,
      applicationStart,
      applicationEnd,
      isLocal,
      boothList,
    } = req.body;

    const parsedBody = addEventSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(422).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues,
      });
    }

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.businessList = Array.isArray(businessList)
      ? businessList
      : [businessList];

    event.applicantList = Array.isArray(applicantList)
      ? applicantList
      : [applicantList];
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
    event.isLocal = isLocal;
    event.boothList = boothList;

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    next(error);
  }
};

// Archive/Unarchive event
const archiveEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.isArchived = isArchived;
    await event.save();
    const action = isArchived ? "archived" : "unarchived";

    return res
      .status(200)
      .json({ message: `Event ${action} successfully`, event });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEventByStatus,
  getEventWithBusiness,
  getEventList,
  getUserEventList,
  getEventPopulated,
  getEvent,
  addEvent,
  editEvent,
  archiveEvent,
};
