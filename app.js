require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controller/globalErrorController");

const authRouter = require("./route/authRoute");
const projectRouter = require("./route/projectRoute");
const userRoute = require("./route/userRoute");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from rest",
  });
});
// app.use("api/v1/auth", authRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/users", userRoute);


app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError("404 - No Route Found...!", 404);
  })
);

// Global Error Handler Middleware
app.use(globalErrorHandler);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on ${PORT}`);
});
