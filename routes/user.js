const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authentication } = require("./userAuth");
// const cors = require("cors");
const book= require("../routes/book");

// Utility function to create JWT token
const createToken = (user) => {
    const authClaims = { name: user.username, role: user.role };
    return jwt.sign(authClaims, "bookStore123", { expiresIn: "30d" });
};

// Sign Up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address, role } = req.body;

        // Check username length
        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 3" });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({username: username});
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check password length
        if (password.length <= 5) {
            return res.status(400).json({ message: "Password length should be greater than 5" });
        }

        // Create new user with hashed password and assigned role
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            email:email,
            password: hashPass,
            address: address,
            role: role || 'user' // Default to 'user' if no role is specified
        });

        await newUser.save();

        // Generate JWT token
        const token = createToken(newUser);

        return res.status(200).json({ 
            message: "SignUp Successfully", 
            id: newUser._id, 
            username: newUser.username, 
            token: token 
        });

    } catch (error) {
        console.error("Error during sign-up:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


// Sign In


// router.post("/sign-in", async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         console.log("Received Username and Password:", username, password);

//         // Check if user exists in the database
//         const existingUser = await User.findOne({ username });
//         console.log("Existing User:", existingUser);

//         if (!existingUser) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Compare passwords using bcrypt
//         const isMatch = await bcrypt.compare(password, existingUser.password);

//         if (isMatch) {
//             // Create the JWT token with user details
//             const authClaims = {
//                 name: existingUser.username,
//                 role: existingUser.role,
//             };

//             const token = jwt.sign(authClaims, "bookStore", {
//                 expiresIn: "30d", // Token validity
//             });

//             // Respond with user info and token
//             return res.status(200).json({
//                 id: existingUser._id,
//                 role: existingUser.role,
//                 token: token,
//             });
//         } else {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }
//     } catch (error) {
//         console.error("Error during sign-in:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });




router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username,password);
        const existingUser = await User.findOne({ username });
        console.log("existingUser",existingUser);
        if (!existingUser) {
             res.status(400).json({ message: "Invalid credentials" });
        }

//         await bcrypt.compare(password, existingUser.password, (err, data)=>{
//             if(data){
//                 const authClaims=[
//                     {name:existingUser.username},
//                     {role: existingUser.role},
    
//                 ];
//                 const token = jwt.sign({authClaims}, "bookStore",{
//                     expiresIn: "30d",

//                 });
//                 res.status(200).json({ id: existingUser._id, role: existingUser.role, token: token});
                
//             }else{
//                 res.status(400).json({message:" Internal server error"});
//             }
           
//         });
    

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (isMatch) {
            const token = createToken(existingUser);
            return res.status(200).json({ 
                message: "SignIn Successfully", 
                id: existingUser._id, 
                role: existingUser.role, 
                token: token 
            });
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get User Information
// router.get("/get-user-information", authentication, async (req, res) => {
router.get("/get-user-information", async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching user information:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Update Address
router.put("/update-address", authentication, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address });
        return res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
