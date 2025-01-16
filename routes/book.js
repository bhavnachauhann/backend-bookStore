const router = require("express").Router();
const User = require("../models/user");
const Book= require("../models/book");

const jwt = require("jsonwebtoken");
const { authentication } = require("./userAuth");



// add book --admin

router.post("/add-book", authentication, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);

        if (user || user.role !== "admin") {
            return res.status(403).json({ message: "You don't have access to perform admin work" });
        }

        const newBook = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });

        await newBook.save();
        res.status(200).json({ message: "Book added successfully" });

    } catch (error) {
        console.error("Error adding book:", error); // Log error for troubleshooting
        return res.status(500).json({ message: "Internal server error" });
    }
});

// update book

// router.put("/update-book",  authentication, async (req, res) => {
   
router.put("/update-book",  async (req, res) => {
    try {
        const { bookid } = req.headers;

        // Ensure the book ID is provided
        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        // Update the book
        const updatedBook = await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        }, { new: true }); // Return the updated document

        // Check if the book was found and updated
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ message: "Book updated successfully", updatedBook });
    } catch (error) {
        console.error("Error updating book:", error); // Log error
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/delete-book", authentication, async (req, res) => {
    try {
        const { bookid } = req.headers;
      await Book.findByIdAndDelete(bookid)

        return res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
         
        return res.status(500).json({ message: "Internal server error" });
    }
});

// get all books 
router.get("/get-all-book", async (req, res) => {
    try {
        const books= await Book.find().sort({ createdAt: -1}).limit(4);
        
        return res.json({ status: "Success", 
            data:books,
         });

    } catch (error) {
         
        return res.status(500).json({ message: "Internal server error" });
    }
});

//  get book by id 

router.get("/get-recent-books", async (req, res) => {
    try {
        const books =await Book.find().sort({ createdAt: -1}).limit(4);
        return res.json({
            status: "Success",
            data: books,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"});
        
    }
    
});

router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const {id}= req.params;
        const book= await Book.findById(id);
        
        return res.json({ status: "Success", 
            data:book,
         });

    } catch (error) {
         
        return res.status(500).json({ message: "Internal server error" });
    }
});







module.exports= router;
