const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    tradeName: { type: String, required: true },
    legalName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    region: String,
    city: { type: String, required: true },
    address: { type: String, required: true },
    postCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    taxNumber: { type: String, required: true, unique: true },
    contactPerson: { type: String, required: true },
    subscription: {
      type: String,
      enum: ["Free", "Basic", "Premium"],
      default: "Free",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
