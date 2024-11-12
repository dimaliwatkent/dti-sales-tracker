const mongoose = require('mongoose')

const BusinessAwardsSchema = new mongoose.Schema(
  {
    award: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'award',
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v)
        },
        message: 'Invalid award ObjectId'
      }
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'business',
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v)
        },
        message: 'Invalid business ObjectId'
      }
    },
    dateAwarded: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (v) {
          const currentYear = new Date().getFullYear()
          return v.getFullYear() <= currentYear
        },
        message: 'Date awarded cannot be in the future'
      }
    },
    isArchived: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (v) {
          return typeof v === 'boolean'
        },
        message: 'isArchived must be a boolean value'
      }
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('businessAwards', BusinessAwardsSchema)
