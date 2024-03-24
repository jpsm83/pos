const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderTime: { type: Date, default: Date.now, required: true },
    totalPrice: { type: Number, required: true },
    billingStatus: {
      type: String,
      enum: ["Open", "Payed", "Wasted", "Cancelled", "Invitation"],
    },
    orderStatus: { type: String, enum: ["Sent", "Done", "Dont Make", "Hold"] },
    pos: { type: mongoose.Schema.Types.ObjectId, ref: "Pos", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessGoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "BusinessGood", required: true }],
    business: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
