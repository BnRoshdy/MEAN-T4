const mongoose = require("mongoose")
const slugify = require("slugify")
const Product = require('../models/productmodel') 


const get_product_byId = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const product = await Product.findById(id).populate("category")

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
    const { name, description, price, brand, categoryId, images, specifications, stock, sku, featured = false } = req.body

    if (!name || !description || !price || !brand || !categoryId || !images) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, description, price, category, brand",
      })
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category:categoryId,
      brand,
      images,
      specifications,
      stock: parseInt(stock) || 0,
      sku: slugify(name),
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



const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

 if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }
  
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate("category");
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    
    res.status(200).json({
      message: "Product updated successfully.",
      product: updatedProduct
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





const deleteProduct = async (req, res) => {
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
    res.status(500).json({ success: false, message: "Server error", error: err.message })
  }
}

const get_all_brands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand")
    res.json({ success: true, data: brands })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

const get_all_products = async (req, res) => {
  try {
    const {
      categoryId,
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

    if (categoryId) filter.category = categoryId
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

    const products = await Product.find(filter).populate("category")
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
    res.status(500).json({ success: false, message: "Server error" })
  }
}






module.exports = {
  get_all_products,
  get_product_byId,
  add_product,
  updateProduct,
  deleteProduct,
  get_all_brands,
}
