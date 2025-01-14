const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        require:true,
        minLength:4,
        maxLength:50,
        trim:true,
        unique:true

    },
    lastName : {
        type:String,
        minLength:4,
        maxLength:50,
        trim:true,

    },
    email : {
        type : String,
        lowercase:true,
        required:true,
        trim:true,
        unique:true,
    },
    password : {
        type : String,
        required:true,
    },
    gender : {
        type: String,
        validate(value) {
            if(!['male', 'female', 'other'].includes(value)){
                throw new Error("Enter invalid gender!");
            }
                
        }
    },
    about:{
        type:String,
        default:"Write something about you"
    },
    photoUrl:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png"
    },
    skill:{
        type:['String'],
    },

},
{
    timestamps:true
}
)

const User = mongoose.model("User", userSchema);
module.exports = User;