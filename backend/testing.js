const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Manager", "Employee", "Supervisor", "Client"],
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: String,
    joiningDate: Date,
    terminateDate: Date,
    onDuty: { type: Boolean, default: false },
  },
  { timestamps: true }
);

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
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderTime: { type: Date, default: Date.now, required: true },
    totalPrice: { type: Number, required: true },
    billingStatus: {
      type: String,
      enum: ["Open", "Payed", "Wasted", "Cancelled", "Invitation"],
    },
    orderStatus: { type: String, enum: ["Sent", "Done", "Dont Make", "Hold"] },
    pos: { type: mongoose.Schema.Types.ObjectId, ref: "Pos" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    goods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Good" }],
  },
  { timestamps: true }
);

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

module.exports = {
  User: mongoose.model("User", userSchema),
  Business: mongoose.model("Business", businessSchema),
  Order: mongoose.model("Order", orderSchema),
  Pos: mongoose.model("Pos", posSchema),
};