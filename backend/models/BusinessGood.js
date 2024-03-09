// business goods are the products made of a combination of supplye goods, sold by the business to the clients
// also can be individual products that doesnt need to be made and can be sold direct to the clients

const mongoose = require("mongoose");

const CATEGORIES = [
  "Starter",
  "Appertizer",
  "Main",
  "Salad",
  "Desert",
  "Addon",
  "Coffee",
  "Soft Drink",
  "Juice",
  "Beer",
  "Wine",
  "Spirit",
  "Coktail",
  "Mixer",
  "Upgrade",
  "Merchandise",
];

const businessGoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, enum: CATEGORIES },
    available: Boolean,
    price: Number,
    quantity: Number,
    supplyerGoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "SupplyerGood" }],
    busuness: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BusineddGood", businessGoodSchema);
