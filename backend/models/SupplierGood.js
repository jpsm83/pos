// a supplier good is a single product itself, it can be a food or beverage sold by a supplier to a business
// with supplier goods the business can create it owns business goods, which are the products that the business sells to the clients

const mongoose = require("mongoose");

const supplierGoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["Food", "Beverage"] },
    image: {
      type: String,
      default: function() {
        return this.category === "Beverage" ? '../public/images/drink.png' : '../public/images/food.png';
      }
    },
    price: Number,
    available: Boolean,
    quantity: Number,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupplierGood", supplierGoodSchema);
