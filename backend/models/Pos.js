const mongoose = require("mongoose");

const STATUS_OPTIONS = ["Occupied", "Available", "Reserved", "Bill", "Closed"];

const posSchema = new mongoose.Schema(
  {
    openedAt: { type: Date, default: Date.now, required: true },
    closedAt: Date,
    guests: { type: Number, required: true },
    clientName: String,
    posNumber: { type: Number, min: 100, max: 150, required: true },
    status: { type: String, enum: STATUS_OPTIONS },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pos", posSchema);