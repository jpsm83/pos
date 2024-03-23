// a supplier good is a single product itself, it can be a food or beverage sold by a supplier to a business
// with supplier goods the business can create it owns business goods, which are the products that the business sells to the clients

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

const supplierGoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    keyword: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["Food", "Beverage", "Merchandise", "Service"],
      required: true,
    },
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
    measurementType: {
      type: String,
      enum: ["Solid", "Liquid", "Size", "Distance", "Weight", "Service"],
      required: true,
    },
    measurementUnit: {
      type: String,
      required: true,
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
    measurementValue: { type: Number, required: true },
    wholePrice: { type: Number, required: true },
    pricePerMeasurementUnit: { type: Number, required: true },
    virtualQuantityAvailable: { type: Number, default: 0, required: true },
    realQuantityAvailable: { type: Number, default: 0, required: true },
    minimunQuantityRequired: { type: Number, required: true },
    currentlyInUse: { type: Boolean, required: true, default: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupplierGood", supplierGoodSchema);
