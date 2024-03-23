const mongoose = require("mongoose");

const STATUS_OPTIONS = ["Occupied", "Reserved", "Bill", "Closed"];

const posSchema = new mongoose.Schema(
  {
    closedAt: Date,
    guests: { type: Number, required: true },
    clientName: String,
    posNumber: { type: Number, min: 100, max: 150, required: true },
    status: { type: String, enum: STATUS_OPTIONS, default: "Occupied", required: true},
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pos", posSchema);