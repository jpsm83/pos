const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    taxNumber: { type: String, required: true, unique: true },
    contactPerson: { type: String, required: true },
    subscription: {
      type: String,
      enum: ["Free", "Basic", "Premium"],
      required: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pos" }],
    supplyers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplyer" }],
    businessgoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "BusinessGood" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
