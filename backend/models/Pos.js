const mongoose = require("mongoose");

const status = ["Occupied", "Reserved", "Bill", "Closed"];

const posSchema = new mongoose.Schema(
  {
    closedAt:  { type: Date },
    guests: { type: Number },
    clientName: { type: String },
    posReferenceCode: { type: String, required: true },
    status: { type: String, enum: status, default: "Occupied", required: true},
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pos", posSchema);