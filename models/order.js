const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference the User model
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books", // Reference the Books model
      required: true,
    },
    status: {
      type: String, // Use String for predefined statuses
      default: "Order placed",
      enum: ["Order placed", "Out for delivery", "Delivered", "Canceled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
