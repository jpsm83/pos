// a supplyer good is a single product itself, it can be a food or beverage sold by a supplyer to a business
// with supplyer goods the business can create it owns business goods, which are the products that the business sells to the clients

const mongoose = require("mongoose");

const supplyerGoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["Food", "Beverage"] },
    price: Number,
    available: Boolean,
    quantity: Number,
    supplyer: { type: mongoose.Schema.Types.ObjectId, ref: "Supplyer" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupplyerGood", supplyerGoodSchema);
