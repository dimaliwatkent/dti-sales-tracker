const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const serverless = require("serverless-http");

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const adminRouter = require("./routes/admin.cjs");
const userRouter = require("./routes/user.cjs");
const authRouter = require("./routes/auth.cjs");

// app.use((req, res, next) => {
//   // Set the authenticated business object here
//   req.business = { _id: "665ab9bff9e8fa219022b15d" };
//   next();
// });

app.use("/.netlify/functions/api/admin", adminRouter);
app.use("/.netlify/functions/api/user", userRouter);
app.use("/.netlify/functions/api/auth", authRouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB", error));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports.handler = serverless(app);
