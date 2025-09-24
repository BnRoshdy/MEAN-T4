const express = require("express");
<<<<<<< HEAD
const cors = require("cors");
const dataMiddleware = express.json();

const corsMiddleware = cors({
  origin: "*",
//   credentials: true
});

module.exports = { dataMiddleware, corsMiddleware };
=======
const dataMiddleware=express.json()



module.exports={dataMiddleware}
>>>>>>> products
