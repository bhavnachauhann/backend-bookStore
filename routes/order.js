const router = require("express").Router();
const User = require("../models/user");
const Book= require("../models/book");

// const jwt = require("jsonwebtoken");
const { authentication } = require("./userAuth");

const Order = require ("../models/order");
const order = require("../models/order");

//  place order
// router.post('/api/v1/place-order', async (req, res) => {
//     try {
//       // Step 1: Validate request data
//       const { order } = req.body; // Extract order data from the request body
//       const userId = req.headers.id; // Assuming userId is sent in headers
  
//       // Check if `order` and `userId` are provided
//       if (!order || !Array.isArray(order) || order.length === 0) {
//         console.error("Order data is empty or invalid:", order);
//         return res.status(400).json({ message: "Order is empty or invalid." });
//       }
  
//       if (!userId) {
//         console.error("User ID is missing in headers.");
//         return res.status(400).json({ message: "User ID is missing." });
//       }
  
//       // Step 2: Construct order object for the database
//       const orderData = {
//         userId: userId,
//         items: order, // Assuming order is an array of items
//         status: 'Pending', // Example field to track order status
//         createdAt: new Date(),
//       };
  
//       // Step 3: Create order in the database
//       const newOrder = await OrderModel.create(orderData);
//       console.log("Order placed successfully:", newOrder);
  
//       // Step 4: Send success response to the client
//       res.status(200).json({
//         success: true,
//         message: "Order placed successfully",
//         data: newOrder,
//       });
//     } catch (error) {
//       // Log full error details
//       console.error("Error processing order:", error.message || error);
  
//       // Send response with error message
//       res.status(500).json({ message: "Internal server error. Failed to place order." });
//     }
//   });


router.post("/place-order", authentication , async (req, res) => {
  try {
    const{id} = req.headers;
    const{order}= req.body;
    console.log(order);
    for(const orderData of order){
      const newOrder = new Order({ user: id, book: orderData._id});
      
      const orderDataFromDb= await newOrder.save();
      console.log(orderDataFromDb);
      await User.findByIdAndUpdate(id, {
        $push: { order: orderDataFromDb._id},
      });
      await User.findByIdAndUpdate(id,{
        $pull:{ cart: orderData._id},
      });
    }

    return res.json({
      status:"Success",
      message: "Order Placed Successfully",
    });

  }
  catch(error){
    return res.status(500).json({message: "An Error Occured"});

  }
  
})
  
  


// get order history of the particular user
router.get("/get-order-history", authentication, async (req, res) => {
  try {
      // Extract `id` from headers
      const { id } = req.headers;

      // Log the received headers and id
      console.log("id:", id);
      console.log("req.headers:", req.headers);

      // Ensure `id` is provided
      if (!id) {
          return res.status(400).json({ message: "User ID is required in headers" });
      }

      // Fetch user data and populate orders
      const userdata = await User.findById(id).populate({
          path: "order",
          populate: { path: "book" }, // Populate the 'book' inside 'orders'
      });

      // Check if user exists
      if (!userdata) {
          return res.status(404).json({ message: "User not found" });
      }

      // Get and reverse the orders data (if it exists)
      const orderData = userdata.order.reverse() || []; // Fallback to an empty array if no orders
      console.log("orderData:", orderData);

      // Return the response
      return res.json({
          status: "Success",
          data: orderData,
      });
  } catch (error) {
      console.error("Error in /get-order-history:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});


// get all orders  --admin

router.get("/get-all-orders", authentication, async(req, res)=>{
    try {
        
        const userdata= await Order.find().populate({
            path: "book",
            
        })
        .populate({
            path: "user",
        })
        .sort({
            createdAt: -1
        });


        return res.json({ status: "Success", 
            data: userdata,
         });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" }); 
    }
});


// update order --admin
router.put("/update-status/:id", authentication, async(req, res)=>{
    try {
        
        const {id}= req.params;
        await Order.findByIdAndUpdate(id,{ status: req.body.status});


        return res.json({ status: "Success", 
            message: " status Updated Successfully",
         });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" }); 
    }
});






module.exports= router;