const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router=express.Router()
const {dataMiddleware}=require('./middlewares/middleware')
const cartRouter=require('./routes/cartrouter')
const categoeyRouter=require('./routes/categoryrouter')
app.use(express.json());

//middleware
app.use(dataMiddleware);


//routes
app.use('/cart',cartRouter)
app.use('/category',categoeyRouter)


//connect mongodb atlas
mongoose.connect("mongodb+srv://selshenawy69_db_user:DuTikBeEzvyxhryQ@mean-t4.v8igppx.mongodb.net/electronics_web", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(" DB Error:", err));





const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
