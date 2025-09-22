import express from "express"
import { MongoClient, ObjectId } from "mongodb"
import cors from "cors"
const app = express()
const PORT = 3000
const MONGODB_URI = "mongodb+srv://selshenawy69_db_user:DuTikBeEzvyxhryQ@mean-t4.v8igppx.mongodb.net/electronics_web?retryWrites=true&w=majority";
app.use(cors())
app.use(express.json())


let db
async function startServer() {
  try {
    const client = await MongoClient.connect(MONGODB_URI)
    console.log("Connected to MongoDB")
    db = client.db()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to connect to MongoDB and start server:", error)
    process.exit(1) 
  }
}


app.get("/api/products", async (req, res) => {
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
      if (minPrice) filter.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseFloat(maxPrice)
    }


    const sort = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const products = await db
      .collection("products")
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number.parseInt(limit))
      .toArray()

    const totalProducts = await db.collection("products").countDocuments(filter)
    const totalPages = Math.ceil(totalProducts / Number.parseInt(limit))

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: Number.parseInt(page) < totalPages,
        hasPrevPage: Number.parseInt(page) > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) })

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({ success: true, data: product })
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})


app.post("/api/products", async (req, res) => {
  try {
    const { name, description, price, category, brand, images, specifications, stock, sku, featured = false } = req.body

    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, description, price, category, brand",
      })
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      })
    }

    if (sku) {
      const existingProduct = await db.collection("products").findOne({ sku })
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product with this SKU already exists",
        })
      }
    }

    const newProduct = {
      name,
      description,
      price: Number.parseFloat(price),
      category,
      brand,
      images: images || [],
      specifications: specifications || {},
      stock: Number.parseInt(stock) || 0,
      sku: sku || `SKU-${Date.now()}`,
      featured,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(newProduct)
    const createdProduct = await db.collection("products").findOne({ _id: result.insertedId })

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: createdProduct,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const updateData = { ...req.body }
    delete updateData._id 
    updateData.updatedAt = new Date()

    if (updateData.price && updateData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      })
    }


    if (updateData.sku) {
      const existingProduct = await db.collection("products").findOne({
        sku: updateData.sku,
        _id: { $ne: new ObjectId(id) },
      })
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product with this SKU already exists",
        })
      }
    }

    const result = await db.collection("products").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    const updatedProduct = await db.collection("products").findOne({ _id: new ObjectId(id) })

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})


app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})


app.get("/api/products/categories", async (req, res) => {
  try {
    const categories = await db.collection("products").distinct("category")
    res.json({ success: true, data: categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})


app.get("/api/products/brands", async (req, res) => {
  try {
    const brands = await db.collection("products").distinct("brand")
    res.json({ success: true, data: brands })
  } catch (error) {
    console.error("Error fetching brands:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})


app.patch("/api/products/:id/stock", async (req, res) => {
  try {
    const { id } = req.params
    const { stock, operation = "set" } = req.body

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative number",
      })
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

    const result = await db.collection("products").updateOne({ _id: new ObjectId(id) }, updateOperation)

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    const updatedProduct = await db.collection("products").findOne({ _id: new ObjectId(id) })

    res.json({
      success: true,
      message: "Stock updated successfully",
      data: updatedProduct,
    })
  } catch (error) {
    console.error("Error updating stock:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})


startServer() 

export default app
