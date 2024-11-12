const mongoose = require('mongoose')

const AwardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, 'Award name must be at least 3 characters'],
      maxlength: [50, 'Award name cannot exceed 50 characters'],
      unique: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      minlength: [10, 'Award description must be at least 10 characters'],
      validate: {
        validator: function (v) {
          return v.length <= 500
        },
        message: 'Award description cannot exceed 500 characters'
      }
    },
    prize: {
      type: String,
      required: true
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

module.exports = mongoose.model('award', AwardSchema)
