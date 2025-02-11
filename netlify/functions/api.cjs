const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const serverless = require("serverless-http");
const app = express();
const cookieParser = require("cookie-parser");

const credentials = require("./middleware/credentials.cjs");
const corsOptions = require("./config/corsOptions.cjs");
const { globalErrorHandler } = require("./utils/error.cjs");

const authRouter = require("./routes/auth.cjs");
const businessRouter = require("./routes/business.cjs");
const eventRouter = require("./routes/event.cjs");
const saleRouter = require("./routes/sale.cjs");
const userRouter = require("./routes/user.cjs");
const violationRouter = require("./routes/violation.cjs");
const businessViolationRouter = require("./routes/businessViolation.cjs");
const customProductRouter = require("./routes/customProduct.cjs");
const notificationRouter = require("./routes/notification.cjs");
const uploadRouter = require("./routes/upload.cjs");
const boothRouther = require("./routes/booth.cjs");

dotenv.config();

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/.netlify/functions/api/auth", authRouter);
app.use("/.netlify/functions/api/business", businessRouter);
app.use("/.netlify/functions/api/event", eventRouter);
app.use("/.netlify/functions/api/sale", saleRouter);
app.use("/.netlify/functions/api/user", userRouter);
app.use("/.netlify/functions/api/violation", violationRouter);
app.use("/.netlify/functions/api/business-violation", businessViolationRouter);
app.use("/.netlify/functions/api/custom-product", customProductRouter);
app.use("/.netlify/functions/api/notification", notificationRouter);
app.use("/.netlify/functions/api/upload", uploadRouter);
app.use("/.netlify/functions/api/booth", boothRouther);

app.use(globalErrorHandler);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB", error));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports.handler = serverless(app);
