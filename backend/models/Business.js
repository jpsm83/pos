const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    tradeName: { type: String, required: true },
    legalName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    taxNumber: { type: String, required: true, unique: true },
    contactPerson: { type: String, required: true },
    subscription: {
      type: String,
      enum: ["Free", "Basic", "Premium"],
      default: "Free",
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pos" }],
    suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
    businessgoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "BusinessGood" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
