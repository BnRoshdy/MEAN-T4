const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router=express.Router()
const cartRouter=require('./routes/cartrouter')

app.use(express.json());

app.use('/cart',cartRouter)


mongoose.connect("mongodb://127.0.0.1:27017/electronics_web", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(" DB Error:", err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
