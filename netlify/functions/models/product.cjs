const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    // business: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'business',
    //   required: true,
    //   validate: {
    //     validator: function (v) {
    //       return mongoose.Types.ObjectId.isValid(v)
    //     },
    //     message: 'Invalid business ObjectId'
    //   }
    // },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0
        },
        message: 'Price must be a non-negative value'
      }
    },
    isArchived: {
      type: Boolean,
      default: false,
      enum: [true, false],
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

module.exports = mongoose.model('product', ProductSchema)
