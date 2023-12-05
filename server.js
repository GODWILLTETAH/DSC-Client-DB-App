require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");

var morgan = require("morgan");

const { DATABASE, PORT } = process.env;
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("assets"));

//app.use(cors());
//app.use(morgan("dev"));
app.use(cookieParser());

mongoose
  .connect(
    "mongodb://admin3:GloryToGod123@157.230.238.34:27018/DSC_Client_Database?authSource=admin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log("DATABASE CONNECTED"))
  .catch(() => console.log("DATABASE CONNECTION ERROR"));

const clientRoutes = require("./routes/clients");
const indexRoutes = require("./routes/index");
const locationRoutes = require("./routes/location");
app.use("/api/v1/", clientRoutes);
app.use("/", indexRoutes);
app.use("/location", locationRoutes);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`server listening on port ${PORT}`),
);
