const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    }
  },
  { collection:"Categories",
    timestamps: true }
);

 const categoryshcema= mongoose.model("Categories", categorySchema);
module.exports=categoryshcema;