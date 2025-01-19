const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const { connectDB } = require("./config/database");
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/connection")


app.use(express.json());
app.use(cookieParser())

app.use("/",  authRouter);
app.use("/profile", profileRouter);
app.use("/", connectionRouter)

connectDB()
  .then(() => {
    console.log("Database connection sucessfully");
    app.listen(7777, (req, res) => {
      console.log("server is sucessfully running at port: 7777");
    });
  })
  .catch((err) => console.log("database connection failed", err.message));
