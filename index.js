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



const User = require("./models/user.js")


//create a schema
app.post("/addUser", async (req,res) => {

  // Validate required fields
  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ error: "All fields (fname, lname, email, password) are required" });
  }
  try {
    const newUser = new User()
    const userFname = req.body.fname
    const userLname = req.body.lname
    const userEmail = req.body.email
    const userPassword = req.body.password
    newUser.fname = userFname
    newUser.lname = userLname
    newUser.email  = userEmail
    newUser.password = userPassword

    console.log(newUser);
    
    // the way to wait untile save it in DB
    await newUser.save()
    res.json(newUser)
    // res.send("the new article hass been stored")

  } catch (error) {
      console.log("Error while reading article id", id);
      return res.send("Error")
  }

})

app.get("/getAllUsers", async (req,res) =>{
    const users = await User.find()
    res.json(users)
})

app.get("/users/:userID", async (req,res) =>{
    const id = req.params.userID

    try {
        const user = await User.findById(id)
        res.json(user)

    } catch (error) {
        console.log("Error while reading user id", id);
        return res.send("Error")
    }
})

app.delete("/users/:userID", async (req,res) =>{
    const id = req.params.userID

    try {
        const user = await User.findByIdAndDelete(id)
        res.json(user)
        
    } catch (error) {
        console.log("Error while reading user id", id);
        return res.send("Error")
    }
})


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
