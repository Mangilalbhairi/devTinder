require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { connectDB } = require("./config/database");

const PORT = process.env.PORT || 7777

//import routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/connection");
const userRouter = require("./routes/user");
const cors = require("cors");

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//routes
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/", connectionRouter);
app.use("/user", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection sucessfully");
    app.listen(PORT, (req, res) => {
      console.log("server is sucessfully running at port:",PORT);
    });
  })
  .catch((err) => console.log("database connection failed", err.message));
// app.listen(PORT, () => console.log("server running"))
