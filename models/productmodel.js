const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [1, "Price must be greater than 0"],
    },
    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
    required: true
  },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    images: {
      type: [String], 
      required:[true, "Images is required"]
    },
    specifications: {
      type: Object, 
      default: {},
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    sku: {
      type: String,
      unique: true,
    },
    featured: {
      type: Boolean,
      default: false,
    }
  },
  {
    versionKey: false,
    collection:"Products",
    timestamps:true

  }
)


const Product = mongoose.model("Products", productSchema)

module.exports = Product
