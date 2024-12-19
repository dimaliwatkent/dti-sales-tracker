const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  business: {
    type: String,
  },
});

const EventSchema = new mongoose.Schema(
  {
    businessList: [{ type: mongoose.Schema.Types.ObjectId, ref: "business" }],
    applicantList: [{ type: mongoose.Schema.Types.ObjectId, ref: "business" }],
    title: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
    documentList: [{ type: String }],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    applicationStart: {
      type: Date,
    },
    applicationEnd: {
      type: Date,
    },
    status: {
      type: String,
      default: "upcoming",
    },
    isLocal: {
      type: Boolean,
    },
    boothList: [boothSchema],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("event", EventSchema);
