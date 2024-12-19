const User = require("../models/user.cjs");
const Sale = require("../models/sale.cjs");
const Business = require("../models/business.cjs");
const mongoose = require("mongoose");
const Event = require("../models/event.cjs");
const moment = require("moment");

// GET /sale - return unarchived events
// GET /sale?isArchived=true
const getEventSale = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId)
      .populate({
        path: "businessList",
        select: "_id name saleList",
        populate: {
          path: "saleList",
          select: "_id createdAt totalAmount",
        },
      })
      .select("_id title startDate endDate businessList")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Calculate total amount of sales for each business
    event.businessList.forEach((business) => {
      const totalAmount = business.saleList.reduce((acc, sale) => {
        return acc + parseFloat(sale.totalAmount.toString());
      }, 0);
      business.totalSale = totalAmount;
    });

    return res.status(200).json({ event });
  } catch (error) {
    next(error);
  }
};

const getRecordData = async (req, res, next) => {
  try {
    const isArchived = req.query.isArchived === "true";

    const eventList = await Event.find({ isArchived, status: "ongoing" })
      .populate({
        path: "businessList",
        populate: {
          path: "saleList",
          model: "sale",
        },
      })
      .populate({
        path: "applicantList",
      })
      .exec();

    if (!eventList || eventList.length === 0) {
      return res.status(200).json({ record: [] });
    }

    const recordData = eventList.map((event) => {
      const businessList = event.businessList;
      const rejectedList = businessList.filter(
        (business) => business.applicationStatus.toLowerCase() === "rejected",
      );
      const applicantList = businessList.filter((business) =>
        ["forcompletion", "pending", "complied"].includes(
          business.applicationStatus.toLowerCase(),
        ),
      );

      const businesses = businessList.map((business) => ({
        businessId: business._id,
        businessName: business.name,
        totalAmount: business.saleList.reduce(
          (acc, sale) => acc + parseFloat(sale.totalAmount.toString()),
          0,
        ),
        targetSales: business.targetSale,
        dailySales: business.saleList.map((sale) => ({
          saleId: sale._id,
          createdAt: sale.createdAt,
          totalSales: sale.transactionList.reduce(
            (acc, transaction) =>
              acc + parseFloat(transaction.totalAmount.toString()),
            0,
          ),
        })),
        category: business.category,
      }));

      const overallTotalAmount = businesses.reduce(
        (acc, business) => acc + business.totalAmount,
        0,
      );

      return {
        eventId: event._id,
        eventName: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        exhibitorCount: businessList.length,
        rejectedCount: rejectedList.length,
        applicantCount: applicantList.length,
        overallAmount: overallTotalAmount,
        businessList: businesses,
      };
    });

    return res.status(200).json({ record: recordData });
  } catch (error) {
    next(error);
  }
};

const getSale = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid sale ID" });
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: "No sale found" });
    }
    return res
      .status(200)
      .json({ message: "Sale retrieved successfully", sale });
  } catch (error) {
    next(error);
  }
};

const generateDailySale = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Validate if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Get business IDs from user's business list
    const businessIds = user.businessList;

    // Find ongoing events for the businesses
    const events = await Event.find({
      businessList: { $in: businessIds },
      status: "ongoing",
    });

    if (events.length === 0) {
      return res.status(404).json({
        message: "No ongoing events found for this user's businesses",
      });
    }

    const today = moment().startOf("day").toDate();
    const tomorrow = moment().endOf("day").toDate();

    const sales = [];

    for (let event of events) {
      const businessId = event.businessList.find((id) =>
        businessIds.includes(id),
      );
      const sale = await Sale.findOne({
        business: businessId,
        event: event._id,
        createdAt: { $gte: today, $lte: tomorrow },
      });

      if (!sale) {
        const newSale = new Sale({
          event: event._id,
          business: businessId,
          transactionList: [],
          totalAmount: { $numberDecimal: "0" },
        });

        await newSale.save();

        await Business.findByIdAndUpdate(businessId, {
          $push: { saleList: newSale._id },
        });

        sales.push({ ...newSale.toObject(), eventTitle: event.title });
      } else {
        sales.push({ ...sale.toObject(), eventTitle: event.title });
      }
    }

    return res.status(200).json({ sale: sales });
  } catch (error) {
    next(error);
  }
};

const updateSale = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid sale ID" });
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const { transaction } = req.body;

    if (transaction) {
      sale.transactionList.push(transaction);

      sale.totalAmount = sale.transactionList.reduce(
        (acc, curr) => acc + parseFloat(curr.totalAmount.toString()),
        0,
      );
    }

    await sale.save();
    return res.status(200).json({ message: "Sale updated successfully", sale });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEventSale,
  getRecordData,
  getSale,
  generateDailySale,
  updateSale,
};
