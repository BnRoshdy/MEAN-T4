const mongoose = require("mongoose")
const Product = require('../models/productmodel') 



const get_all_products = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query

    const filter = {}

    if (category) filter.category = category
    if (brand) filter.brand = new RegExp(brand, "i")
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
      ]
    }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    const sort = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))

    const totalProducts = await Product.countDocuments(filter)
    const totalPages = Math.ceil(totalProducts / parseInt(limit))

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}


const get_product_byId = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({ success: true, data: product })
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

const add_product = async (req, res) => {
  try {
    const { name, description, price, category, brand, images, specifications, stock, sku, featured = false } = req.body

    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, description, price, category, brand",
      })
    }

    if (price <= 0) {
      return res.status(400).json({ success: false, message: "Price must be greater than 0" })
    }

    if (sku) {
      const existingProduct = await Product.findOne({ sku })
      if (existingProduct) {
        return res.status(400).json({ success: false, message: "Product with this SKU already exists" })
      }
    }

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      brand,
      images: images || [],
      specifications: specifications || {},
      stock: parseInt(stock) || 0,
      sku: sku || `SKU-${Date.now()}`,
      featured,
    })

    const createdProduct = await newProduct.save()

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: createdProduct,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

const edit_product_id = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const updateData = { ...req.body, updatedAt: new Date() }
    delete updateData._id

    if (updateData.price && updateData.price <= 0) {
      return res.status(400).json({ success: false, message: "Price must be greater than 0" })
    }

    if (updateData.sku) {
      const existingProduct = await Product.findOne({ sku: updateData.sku, _id: { $ne: id } })
      if (existingProduct) {
        return res.status(400).json({ success: false, message: "Product with this SKU already exists" })
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updateData }, { new: true })

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({ success: true, message: "Product updated successfully", data: updatedProduct })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

const delete_product_id = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

const get_all_categories_products = async (req, res) => {
  try {
    const categories = await Product.distinct("category")
    res.json({ success: true, data: categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

const get_all_brands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand")
    res.json({ success: true, data: brands })
  } catch (error) {
    console.error("Error fetching brands:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

const update_stock_product = async (req, res) => {
  try {
    const { id } = req.params
    const { stock, operation = "set" } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({ success: false, message: "Stock must be a non-negative number" })
    }

    let updateOperation
    if (operation === "increment") {
      updateOperation = { $inc: { stock: stock } }
    } else if (operation === "decrement") {
      updateOperation = { $inc: { stock: -stock } }
    } else {
      updateOperation = { $set: { stock: stock } }
    }

    updateOperation.$set = { ...updateOperation.$set, updatedAt: new Date() }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateOperation, { new: true })

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({ success: true, message: "Stock updated successfully", data: updatedProduct })
  } catch (error) {
    console.error("Error updating stock:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

module.exports = {
  get_all_products,
  get_product_byId,
  add_product,
  edit_product_id,
  delete_product_id,
  get_all_categories_products,
  get_all_brands,
  update_stock_product,
}
