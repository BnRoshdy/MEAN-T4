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
