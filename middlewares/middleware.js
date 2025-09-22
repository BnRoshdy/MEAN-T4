const express = require("express");
const cors = require("cors");
const dataMiddleware = express.json();

const corsMiddleware = cors({
  origin: "*",
//   credentials: true
});

module.exports = { dataMiddleware, corsMiddleware };
