// a supplier good is a single product itself, it can be a food or beverage sold by a supplier to a business
// with supplier goods the business can create it owns business goods, which are the products that the business sells to the clients

const mongoose = require("mongoose");

const supplierGoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["Food", "Beverage"] },
    price: Number,
    available: Boolean,
    quantity: Number,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupplierGood", supplierGoodSchema);
