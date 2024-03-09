const mongoose = require("mongoose");

const roles = [
  "Manager",
  "Bartender",
  "Waiter",
  "Head Chef",
  "Sous Chef",
  "Line Cooks",
  "Kitchen Porter",
  "Cleaner",
  "Security",
  "Host",
  "Runner",
  "Supervisor",
  "Client",
];
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: roles,
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: String,
    joiningDate: Date,
    terminateDate: Date,
    active: { type: Boolean, default: true },
    onDuty: { type: Boolean, default: false},
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
