const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    tradeName: { type: String, required: true },
    legalName: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    region: { type: String },
    city: { type: String, required: true },
    address: { type: String, required: true },
    postCode: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    taxNumber: { type: String, required: true, unique: true },
    contactPerson: { type: String },
    supplierGoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "SupplierGood" }],
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Supplier", supplierSchema);
