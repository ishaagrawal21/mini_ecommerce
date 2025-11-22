const express = require("express");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const connectDb = require("./connection");
const productsRouter = require("./router/ProductRoutes");
const errorHandler = require("./middleware/errorHandler");
const categoryRouter = require("./router/CategoryRoutes");
const authRouter = require("./router/AuthRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
connectDb();
require("dotenv").config();

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoryRouter);

// error handler
app.use(errorHandler);


const PORT = process.env.PORT ;


app.listen(PORT, () => {
  console.log("Server Started");
});
