const User = require("../models/user.cjs");
const Sale = require("../models/sale.cjs");
const Business = require("../models/business.cjs");
const mongoose = require("mongoose");
const Event = require("../models/event.cjs");
const moment = require("moment");

// handle error
const handleError = (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", err: err.message });
};

// GET /sale - return unarchived events
// GET /sale?isArchived=true
const getEventSale = async (req, res) => {
  try {
    const { eventId } = req.params;
    const isArchived = req.query.isArchived === "true";

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const sales = await Sale.find({ event: eventId, isArchived })
      .populate("business")
      .populate("event")
      .exec();

    if (!sales.length) {
      return res.status(404).json({ message: "No sales found" });
    }

    let eventTotalSale = 0;

    // sales.forEach((sale) => {
    //   sale.product.forEach((product) => {
    //     eventTotalSale += parseFloat(product.totalPrice.toString());
    //   });
    // });

    return res.status(200).json({ sale: sales, eventTotalSale });
  } catch (err) {
    handleError(res, err);
  }
};

const getRecordData = async (req, res) => {
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
  } catch (err) {
    handleError(res, err);
  }
};

const getSale = async (req, res) => {
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
  } catch (err) {
    handleError(res, err);
  }
};

// const getSalesRecord = async (req, res) => {
//   try {
//     const businessId = req.params.businessId;
//     const business = await Business.findById(businessId);
//
//     if (!business) {
//       return res.status(404).json({ message: "Business not found" });
//     }
//
//     const salesRecord = [];
//
//     const eventId = business.event;
//     const event = await Event.findById(eventId);
//     const sales = await Sale.find({ event: eventId });
//
//     salesRecord.push({
//       eventId: event._id,
//       eventTitle: event.title,
//       sale: sales.map((sale) => ({
//         _id: sale._id,
//         business: sale.business,
//         event: sale.event,
//         product: sale.product,
//         isArchived: sale.isArchived,
//         createdAt: sale.createdAt,
//         updatedAt: sale.updatedAt,
//       })),
//     });
//
//     return res.status(200).json({ salesRecord });
//   } catch (err) {
//     handleError(res, err);
//   }
// };

const generateDailySale = async (req, res) => {
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
  } catch (err) {
    handleError(res, err);
  }
};

const updateSale = async (req, res) => {
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
  } catch (err) {
    handleError(res, err);
  }
};

const getAllEventSales = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const sales = await Sale.find({ event: eventId })
      .populate("business")
      .exec();

    if (!sales.length) {
      return res.status(404).json({ message: "No sales found" });
    }

    const businessSales = {};

    sales.forEach((sale) => {
      const businessName = sale.business.name;
      const saleDate = moment(sale.createdAt).format("YYYY-MM-DD");

      if (!businessSales[businessName]) {
        businessSales[businessName] = {
          businessName,
          dailySales: [],
          totalSales: 0,
        };
      }

      const dailySale = businessSales[businessName].dailySales.find(
        (ds) => ds.date === saleDate,
      );

      let saleTotal = 0;
      sale.product.forEach((product) => {
        saleTotal += parseFloat(product.totalPrice.toString());
      });

      if (dailySale) {
        dailySale.totalSales += saleTotal;
      } else {
        businessSales[businessName].dailySales.push({
          date: saleDate,
          totalSales: saleTotal,
        });
      }

      businessSales[businessName].totalSales += saleTotal;
    });

    return res.status(200).json(Object.values(businessSales));
  } catch (err) {
    handleError(res, err);
  }
};

// Archive/Unarchive sale
const archiveSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid sale ID" });
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    sale.isArchived = isArchived;

    await sale.save();
    const action = isArchived ? "archived" : "unarchived";
    return res
      .status(200)
      .json({ message: `Sale ${action} successfully`, sale });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getEventSale,
  getRecordData,
  getAllEventSales,
  getSale,
  // getSalesRecord,
  generateDailySale,
  updateSale,
  archiveSale,
};
