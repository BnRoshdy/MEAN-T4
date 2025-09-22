const User = require("./models/user.js")


const addUser=async (req,res) => {

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
    
    await newUser.save()
    res.json(newUser)

  } catch (error) {
      console.log("Error while reading article id", id);
      return res.send("Error")
  }

}

const getallUsers= async (req,res) =>{
    const users = await User.find()
    res.json(users)
}






 const getUserbyID=async (req,res) =>{
    const id = req.params.userID

    try {
        const user = await User.findById(id)
        res.json(user)

    } catch (error) {
        console.log("Error while reading user id", id);
        return res.send("Error")
    }
}

const deleteUserbyID= async (req,res) =>{
    const id = req.params.userID

    try {
        const user = await User.findByIdAndDelete(id)
        res.json(user)
        
    } catch (error) {
        console.log("Error while reading user id", id);
        return res.send("Error")
    }
}



module.exports={addUser,deleteUserbyID, getUserbyID,getallUsers}