const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
   fname:{
        type:String,
        required:true,
        minLength:2,
        maxlength:20
    },
    lname:{
        type:String,
        required:true,
        minLength:2,
        maxlength:20
    },
    email:{
        type:String,
        required: true,
        unique:true,
        validate:{
            validator:function (email){
                return /^[a-zA-Z]{4,10}[0-9]{0,4}(@)(gmail|yahoo)(.com)$/.test(email)
            },
            message: (prop)=> `${prop.value} is not correct `
        }
    },
    password:{
        type:String,
        required:true
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User