const asyncHandler = require("express-async-handler");
const Supplier = require("../models/Supplier");
const SupplierGood = require("../models/SupplierGood");

// @desc    Get all suppliers
// @route   GET /supplier
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
  // Fetch all suppliers from the database
  const suppliers = await Supplier.find().lean();
  if (!suppliers) {
    // If no suppliers are found, return a 404 status code with a message
    return res.status(404).json({ message: "No suppliers found!" });
  }
  // Return the suppliers
  res.json(suppliers);
});

// @desc    Get supplier by ID
// @route   GET /supplier/:id
// @access  Private
const getSupplierById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch the supplier with the given ID from the database
  const supplier = await Supplier.findById(id).lean();

  if (!supplier) {
    // If the supplier is not found, return a 404 status code with a message
    return res.status(404).json({ message: "Supplier not found!" });
  }

  // Return the supplier
  res.json(supplier);
});

// @desc   Get supplier by business ID
// @route  GET /supplier/business/:id
// @access Private
const getSupplierByBusinessId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Fetch suppliers with the given business ID from the database
  const suppliers = await Supplier.find({ business: id }).lean();
  if (!suppliers) {
    // If no suppliers are found, return a 404 status code with a message
    return res.status(404).json({ message: "No suppliers found!" });
  }
  // Return the suppliers
  res.json(suppliers);
});

// @desc    Create new supplier
// @route   POST /supplier
// @access  Private
const createNewSupplier = asyncHandler(async (req, res) => {
  const {
    name,
    country,
    region,
    city,
    address,
    postCode,
    email,
    phoneNumber,
    taxNumber,
    contactPerson,
    business,
  } = req.body;

  // Check if all required data is provided
  if (
    !name ||
    !country ||
    !city ||
    !address ||
    !postCode ||
    !email ||
    !phoneNumber ||
    !taxNumber ||
    !contactPerson ||
    !business
  ) {
    return res.status(400).json({ message: "Name, country, city, address, postCode, email, phoneNumber, taxNumber, contactPerson and business are required!" });
  }

  // Check if a supplier with the same tax number already exists
  const duplicateSupplier = await Supplier.findOne({ taxNumber }).lean();
  if (duplicateSupplier) {
    return res.status(400).json({ message: "Supplier already exists!" });
  }

  // Create a new supplier object
  const supplierObj = {
    name,
    country,
    region,
    city,
    address,
    postCode,
    email,
    phoneNumber,
    taxNumber,
    contactPerson,
    business,
  };

  // Save the new supplier to the database
  const newSupplier = await Supplier.create(supplierObj);

  if (newSupplier) {
    res
      .status(201)
      .json({
        message: `Supplier with tax number ${taxNumber} created successfully!`,
      });
  } else {
    res.status(500).json({ message: "Supplier creation failed!" });
  }
});

// @desc    Update supplier
// @route   PATCH /supplier/:id
// @access  Private
const updateSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    country,
    region,
    city,
    address,
    postCode,
    email,
    phoneNumber,
    taxNumber,
    contactPerson,
    supplierGoods,
  } = req.body;

  // Fetch the supplier with the given ID from the database
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    return res.status(404).json({ message: "Supplier not found!" });
  }

  // Update the supplier's details
  supplier.name = name || supplier.name;
  supplier.country = country || supplier.country;
  supplier.city = city || supplier.city;
  supplier.address = address || supplier.address;
  supplier.postCode = postCode || supplier.postCode;
  supplier.email = email || supplier.email;
  supplier.phoneNumber = phoneNumber || supplier.phoneNumber;
  supplier.taxNumber = taxNumber || supplier.taxNumber;
  supplier.contactPerson = contactPerson || supplier.contactPerson;
  supplier.supplierGoods = supplierGoods || supplier.supplierGoods;

  if(region || supplier.region) supplier.region = region || supplier.region;

  // Save the updated supplier to the database
  const updateSupplier = await supplier.save();

  if(updateSupplier) {
    return res.status(200).json({ message: `Supplier with tax number ${supplier.taxNumber} updated successfully!` });
  }else{
    return res.status(500).json({ message: "Failed to update supplier!" });
  }
});

// @desc    Delete supplier
// @route   DELETE /supplier/:id
// @access  Private
const deleteSupplier = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Fetch the supplier with the given ID from the database
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    return res.status(404).json({ message: "Supplier not found!" });
  }

  // Delete all goods related to the supplier
  const supplierGoods = await SupplierGood.find({ supplier: id });
  if (supplierGoods) {
    await SupplierGood.deleteMany({ supplier: id });
  }

  // Delete the supplier
  await supplier.deleteOne();

  res.json({
    message: `Supplier with tax number ${supplier.taxNumber} deleted successfully!`,
  });
});

module.exports = {
  getSuppliers,
  getSupplierById,
  getSupplierByBusinessId,
  createNewSupplier,
  updateSupplier,
  deleteSupplier,
};
