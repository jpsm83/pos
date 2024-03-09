const mongoose = require("mongoose");

const supplyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    taxNumber: { type: String, required: true, unique: true },
    contactPerson: { type: String, required: true },
    supplyerGoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "SupplyerGood" }],
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Supplyer", supplyerSchema);
