const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {dataMiddleware,corsMiddleware}=require('./middlewares/middleware')
const cartRouter=require('./routes/cartrouter')
const userRouter=require('./routes/usersrouter')
const categoeyRouter=require('./routes/categoryrouter')
const productrouter=require('./routes/productrouter')
const {dataMiddleware}=require('./middlewares/middleware')
const cartRouter=require('./routes/cartrouter')
const categoeyRouter=require('./routes/categoryrouter')
const productrouter=require('./routes/productrouter')

require("dotenv").config();

//middleware

app.use(dataMiddleware);
app.use(corsMiddleware)



//routes
app.use('/cart',cartRouter)
app.use('/category',categoeyRouter)
app.use('/user',userRouter)
app.use('/products',productrouter)
app.use('/products',productrouter)




//connect mongodb atlas
mongoose.connect(process.env.mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(" DB Error:", err));





const PORT = process.env.port;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

