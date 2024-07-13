// Dependencies
const dotenv = require("dotenv").config();
const express = require("express");

const app = express();
const compression = require("compression");
var bodyParser = require("body-parser");
// var rateLimit = require("express-rate-limit");
// const { upload } = require("./controllers/s3-management");

// Enable trust proxy setting
// app.set('trust proxy', true);

// const apiLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 2000, // Limit each IP to 2000 requests per `window` (here, per 5 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });


app.use(compression()); // Compress files for performance gains

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json({limit: '50mb'}) );

// Proxy Routes


app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.all("/*", allowCORS);

// API Routes
app.all("/*", get404);

// Functions
async function get404(req, res) {
  res.status(404).json({ success: false, message: "No route exists." });
}

async function allowCORS(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Prismic-ref, Prismic-baseUrl, Token_Auth, tokenId, correlationid");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");

  //intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    //respond with 200
    res.sendStatus(200);
  } else {

    next();
  }
}


module.exports = app;

