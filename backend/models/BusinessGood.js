// business goods are the products made of a combination of supplye goods, sold by the business to the clients
// also can be individual products that doesnt need to be made and can be sold direct to the clients

const mongoose = require("mongoose");

const drinks = ['Coffee', 'Soft Drink', 'Juice', 'Beer', 'Wine', 'Spirit', 'Coktail', 'Mixer', 'Drink Upgrade'];
const foods = ['Starter', 'Appertizer', 'Main', 'Salad', 'Desert', 'Addon'];
const merchandise = ['Tshirt', 'Cap', 'Mug', 'Keychain', 'Bottle Opener', 'Bag', 'Other'];

const CATEGORIES = drinks + foods + merchandise;

const businessGoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, enum: CATEGORIES },
    image: {
      type: String,
      default: function() {
        return drinks.includes(this.category) ? '../public/images/drink.png' : foods.includes(this.category) ? '../public/images/food.png' : '../public/images/merchandise.png';
      }
    },
    available: Boolean,
    price: Number,
    quantity: Number,
    supplierGoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "SupplierGood" }],
    busuness: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BusineddGood", businessGoodSchema);