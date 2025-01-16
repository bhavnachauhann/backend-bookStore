const mongoose= require("mongoose");
const order = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:"books",
    },
    book:{
        type: mongoose.Types.ObjectId,
        ref:"books",
    },
    status:{
        type:mongoose.Types.ObjectId,
        default:"Order placed",
        enum:["order Placed", "out for delivery, Delivered, Canceled"]
        
    },
    
},
{timestamps:true}
);
module.exports=mongoose.model("order", order);