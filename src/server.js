const express = require("express");
const bodyParser = require("body-parser");
const initWebRoutes = require("./routes/web");
const connectDB = require("./configs/connectDB");
require("dotenv").config();

const app = express();
//fix cors = packed cors and const cors = require('cors');
// app.use(cors({
//     origin: true,
//     credentials: true
// }))
//fix cors eque midle ware
// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
//config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("app is running with port " + port);
});
