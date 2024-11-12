const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema(
  {
    businessList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'business' }],
    applicantList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'business' }],
    title: {
      type: String,
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    logo: {
      type: String
    },
    location: {
      type: String,
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    documentList: [{ type: String }],
    startDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return v instanceof Date && !isNaN(v.getTime())
        },
        message: 'Invalid start date'
      }
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return v instanceof Date && !isNaN(v.getTime())
        },
        message: 'Invalid end date'
      }
    },

    applicationStart: {
      type: Date,
      validate: {
        validator: function (v) {
          return v instanceof Date && !isNaN(v.getTime())
        },
        message: 'Invalid application start date'
      }
    },
    applicationEnd: {
      type: Date,
      validate: {
        validator: function (v) {
          return v instanceof Date && !isNaN(v.getTime())
        },
        message: 'Invalid application end date'
      }
    },
    status: {
      type: String,
      default: 'upcoming',
      validate: {
        validator: function (v) {
          const allowedStatuses = [
            'applicationOpen',
            'upcoming',
            'ongoing',
            'completed',
            'cancelled',
            'postponed'
          ]
          return allowedStatuses.includes(v)
        },
        message:
          'Event status must be either upcoming, ongoing, completed, cancelled, or postponed'
      }
    },
    booth: {
      type: Array,
      validate: {
        validator: function (v) {
          return (
            Array.isArray(v) &&
            (v.length === 0 || (v.length > 0 && v.every(Number.isInteger)))
          )
        },
        message:
          'List of available booths must either be empty or contain only integers'
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

module.exports = mongoose.model('event', EventSchema)
