const mongoose= require("mongoose");
const user = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,

    },
    email: { // Add the email field 
        type: String, 
        required: true, 
        unique: true, 
    },
    password:{
        type:String,
        required: true,
      
    },
    address:{
        type:String,
        required: true,
        
    },
    avatar:{
        type:String,
       default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonduck.com%2Ficons%2F163613%2Fdefault&psig=AOvVaw0aNuNMiQgFG5oFDueVqXHD&ust=1729946284174000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJjlhqDGqYkDFQAAAAAdAAAAABAE"
    },
    role:{
        type:String,
        default:"user",
        enum: ["user", "admin"]
    },
     favourites:[{
        type: mongoose.Types.ObjectId,
        ref:"books",
     },],
     cart:[{
        type: mongoose.Types.ObjectId,
        ref:"books",
     },],
     order:[{
        type:mongoose.Types.ObjectId,
        ref:"order",
     },],
},
{timestamps:true}
);
module.exports=mongoose.model("user", user);