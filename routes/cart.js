const router = require("express").Router();
const User = require("../models/user");
const Book= require("../models/book");

// const jwt = require("jsonwebtoken");
const { authentication } = require("./userAuth");


// put book to cart

router.put("/add-to-cart", authentication, async(req, res)=>{
    try {
        
        const {bookid ,id}=req.headers;
        const userdata= await User.findById(id);
        const isBookinCart= userdata.cart.includes(bookid);
        if (isBookinCart) {
            return res.json({ status: "Success", 
                message: "book is already in the cart",
             });
        }

        await User.findByIdAndUpdate(id,{
            $push: {cart: bookid},
        });

        return res.json({ status: "Success", 
            message: "book added to the cart",
         });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" }); 
    }
});


//  remove from the cart
router.put("/remove-from-cart/:bookid", authentication, async(req, res)=>{
    try {
        
        const {bookid}=req.params;
        const {id}=req.headers;
        await User.findByIdAndUpdate(id,{
            $pull: {cart: bookid},
        })

        return res.json({ status: "Success", 
            message: "book removed  from the cart",
         });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" }); 
    }
});


// get cart of a particular user

router.get("/get-user-cart", authentication, async(req, res)=>{
    try {
    
        const {id}=req.headers;
        const userdata= await User.findById(id).populate("cart");
        const cart = userdata.cart.reverse();

        return res.json({ status: "Success", 
            data: cart,
         });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" }); 
    }
});

module.exports= router;