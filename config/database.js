const mongoose = require("mongoose")
const connectDB = async ()  => {
    await mongoose.connect("mongodb+srv://mangilalbhairi:V2S273Gv9QgGLGRL@myfirstcluster.dszng.mongodb.net/devTinder")

}

module.exports = {connectDB};