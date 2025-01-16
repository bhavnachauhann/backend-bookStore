const router = require("express").Router();
const User = require("../models/user");
// const Book= require("../models/book");

// const jwt = require("jsonwebtoken");
const { authentication } = require("./userAuth");



router.put("/add-book-to-favourite", authentication, async (req, res) => {
    try {
        const {bookid, id}= req.headers;
        const userdata= await User.findById(id);

        const isBookFavourite = userdata.favourites.includes(bookid);
        if(isBookFavourite){
            return  res.status(200).json({ message: "Book already in favourites" });
        }
      
        await User.findByIdAndUpdate(id, { $push: {favourites: bookid}});

       return  res.status(200).json({ message: "Book added in favourites" });

    } catch (error) {
        console.error("Error adding book:", error); // Log error for troubleshooting
        return res.status(500).json({ message: "Internal server error" });
    }
});


// add book to favorites

router.delete("/remove-book-from-favourite", authentication, async (req, res) => {
    try {
        const {bookid, id}= req.headers;
        const userdata= await User.findById(id);
        console.log("User Favourites:", userdata.favourites);
        

        const isBookFavourite = userdata.favourites.includes(bookid);
        if(isBookFavourite){
            await User.findByIdAndUpdate(id, { $pull: {favourites: bookid}});

        }
        console.log("isBookFavourite", isBookFavourite);
      
       
       return  res.status(200).json({ message: "Book removed from favourites" });

    } catch (error) {
       
        return res.status(500).json({ message: "Internal server error in remove from favrouite" });
    }
});


//  get favourite books of a particular user

router.get("/get-favourite-book", authentication, async (req, res) => {
    try {
        const {id}= req.headers;
        const userdata= await User.findById(id).populate("favourites");

        const favoriteBooks = userdata.favourites;
        
        return res.json({ 
            status: "Success", 
            data:favoriteBooks,
         });

    } catch (error) {
       
        return res.status(500).json({ message: "Internal server error" });
    }
});



module.exports= router;