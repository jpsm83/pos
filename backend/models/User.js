const mongoose = require("mongoose");

const roles = [
  "Manager",
  "Operator",
  "Employee",
  "Cashier",
  "Floor Staff",
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
  "Table",
];
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    photo: { type: String, default: "../public/images/avatar.png" },
    password: { type: String, required: true },
    idType: {
      type: String,
      enum: ["National ID", "Passport", "Driving License"],
      required: true,
    },
    idNumber: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: roles,
      required: true,
    },
    personalDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      nationality: { type: String, required: true },
      gender: { type: String, enum: ["Man", "Woman", "Other"], required: true },
      birthDate: { type: Date, required: true },
      phoneNumber: { type: String, required: true },
    },
    address: {
      country: { type: String, required: true },
      region: { type: String },
      city: { type: String, required: true },
      street: { type: String, required: true },
      postCode: { type: String, required: true },
    },
    taxNumber: { type: String, required: true, unique: true },
    joinDate: { type: Date, default: Date.now, required: true },
    contractHoursWeek: { type: Number },
    monthlySalary: { type: Number },
    terminateDate: Date,
    active: { type: Boolean, required: true, default: true },
    onDuty: { type: Boolean, required: true, default: false },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
