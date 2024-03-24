const mongoose = require("mongoose");

const measurementSolid = [
  "Unit",
  "Dozen",
  "Case",
  "Slice",
  "Portion",
  "Piece",
  "Packet",
  "Bag",
  "Box",
  "Can",
  "Jar",
  "Bunch",
  "Bundle",
  "Roll",
  "Bottle",
  "Container",
  "Crate",
];
const measurementLiquid = [
  "Milliliter",
  "Liter",
  "Bottles",
  "Gallon",
  "Fluid Ounce",
  "Pint",
  "Quart",
  "Cup",
];
const measurementSize = [
  "Small",
  "Medium",
  "Large",
  "Extra large",
  "Double extra large",
  "Triple extra large",
  "Child sizes",
];
const measurementDistance = [
  "Meter",
  "Kilometer",
  "Inch",
  "Foot",
  "Yard",
  "Mile",
  "Millimeter",
  "Centimeter",
];
const measurementWeight = [
  "Gram",
  "Kilogram",
  "Ounce",
  "Pound",
  "Milligram",
  "Centigram",
  "Decigram",
];
const measurementService = [
  "Minute",
  "Hour",
  "Day",
  "Week",
  "Month",
  "Task",
];

const businessGoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    keyword: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ["Food", "Beverage", "Merchandise", "Service"], required: true },
    subCategory: { type: String }, // such as "main course", "appetizer", "dessert", "soft drink", "hard drink", "beer", "wine", "liquor", "snack", "apparel", "accessory", "home goods", "personal care", "service", "other
    image: {
      type: String,
      default: function () {
        return this.category === "Beverage"
          ? "../public/images/drink.png"
          : this.category === "Food"
          ? "../public/images/food.png"
          : this.category === "Merchandise"
          ? "../public/images/merchandise.png"
          : "../public/images/service.png";
      },
    },
    available: { type: Boolean, required: true, default: true },
    quantityAvailable: { type: Number },
    manufacturingCost: { type: Number },
    sellingPrice: { type: Number, required: true },
    supplierGoods: [
      {
        supplierGood: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SupplierGood",
          required: true,
        },
        measurementUsed: {
          type: String,
          enum: {
            values: [
              ...measurementSolid,
              ...measurementLiquid,
              ...measurementSize,
              ...measurementDistance,
              ...measurementWeight,
              ...measurementService,
            ],
          },
        },
        quantityNeeded: { type: Number },
        quantityNeededPrice: { type: Number },
      }
    ],
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BusinessGood", businessGoodSchema);