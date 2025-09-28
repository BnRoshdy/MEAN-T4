const User = require("../models/usermodel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Cart = require("../models/cartmodel");
const mongoose = require("mongoose")


const addUser = async (req, res) => {
  const { fname, lname, email, password, role } = req.body;

  if (!fname || !lname || !email || !password) {
    return res.status(400).json({
      error: "All fields (fname, lname, email, password) are required"
    });
  }


  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
      role
    });

    const newCart = await Cart.create({
      userId: newUser._id
    });
    await newCart.save();

    newUser.cart = newCart._id;
    await newUser.save();


    res.status(201).json({ message: "User created successfully", user: newUser });

  } catch (error) {
    console.error("Error while creating user:", error.message);
    return res.status(500).json({ error: "Error while creating user" });
  }
};


const getallUsers = async (req, res) => {
  const users = await User.find()
  res.json(users)
}



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.secret_key,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const getUserbyID = async (req, res) => {
  const id = req.params.userID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" })
  }
  try {
    const user = await User.findById(id)
    res.json(user)

  } catch (error) {
    console.log("Error while reading user id", id);
    return res.send("Error")
  }
}

const deleteUserbyID = async (req, res) => {
  const id = req.params.userID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" })
  }
  try {
    const user = await User.findByIdAndDelete(id)
    res.json(user)

  } catch (error) {
    console.log("Error while reading user id", id);
    return res.send("Error")
  }
}



module.exports = { addUser, deleteUserbyID, getUserbyID, getallUsers, loginUser }