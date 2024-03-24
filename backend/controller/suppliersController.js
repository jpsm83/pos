const asyncHandler = require("express-async-handler");
const Supplier = require("../models/Supplier");
const SupplierGood = require("../models/SupplierGood");

// @desc    Get all suppliers
// @route   GET /supplier
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
  // fetch all suppliers
  const suppliers = await Supplier.find().lean();
  // if no suppliers are found, return a 404 status code with a message
  if (!suppliers.length) {
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
  // fetch the supplier with the given ID
  const supplier = await Supplier.findById(id).lean();
  // if the supplier is not found, return a 404 status code with a message
  if (!supplier) {
    return res.status(404).json({ message: "Supplier not found!" });
  }
  // return the supplier
  res.json(supplier);
});

// @desc   Get supplier by business ID
// @route  GET /supplier/business/:id
// @access Private
const getSupplierByBusinessId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch suppliers with the given business ID
  const suppliers = await Supplier.find({ business: id }).lean();
  // if no suppliers are found, return a 404 status code with a message
  if (!suppliers.length) {
    return res.status(404).json({ message: "No suppliers found!" });
  }
  // return the suppliers
  res.json(suppliers);
});

// @desc    Create new supplier
// @route   POST /supplier
// @access  Private
const createNewSupplier = asyncHandler(async (req, res) => {
  const {
    tradeName,
    legalName,
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
    business,
  } = req.body;

  // check required fields
  if (
    !tradeName ||
    !legalName ||
    !country ||
    !city ||
    !address ||
    !postCode ||
    !email ||
    !phoneNumber ||
    !taxNumber ||
    !business
  ) {
    return res
      .status(400)
      .json({
        message:
          "TradeName, legalName, country, city, address, postCode, email, phoneNumber, taxNumber and business are required!",
      });
  }

  // check for duplicate legalName, email or taxNumber
  const duplicateSupplier = await Supplier.findOne({
    business: business,
    $or: [{ legalName }, { email }, { taxNumber }],
  }).lean();

  if (duplicateSupplier) {
    return res.status(409).json({
      message: `Supplier ${legalName}, ${email} or ${taxNumber} already exists!`,
    });
  }

  // create supplier object
  const supplierObj = {
    tradeName,
    legalName,
    country,
    city,
    address,
    postCode,
    email,
    phoneNumber,
    taxNumber,
    business,
  };

  // conditionally add non-required fields if they exist
  if (region) supplierObj.region = region;
  if (contactPerson) supplierObj.contactPerson = contactPerson;
  if (supplierGoods) supplierObj.supplierGoods = supplierGoods;

  // save supplier
  const supplier = await Supplier.create(supplierObj);

  if (supplier) {
    res.status(201).json({
      message: `Supplier ${legalName} created successfully!`,
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
    tradeName,
    legalName,
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

  // check required fields
  if (
    !tradeName ||
    !legalName ||
    !country ||
    !city ||
    !address ||
    !postCode ||
    !email ||
    !phoneNumber ||
    !taxNumber
  ) {
    return res
      .status(400)
      .json({
        message:
          "TradeName, legalName, country, city, address, postCode, email, phoneNumber and taxNumber are required!",
      });
  }

  // check if supplier exists
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    return res.status(404).json({ message: "Supplier not found!" });
  }

  // check for duplicate legalName, email or taxNumber
  const duplicateSupplier = await Supplier.findOne({
    _id: { $ne: id },
    business: supplier.business,
    $or: [{ legalName }, { email }, { taxNumber }],
  }).lean();

  if (duplicateSupplier) {
    return res.status(409).json({
      message: `Business ${legalName}, ${email} or ${taxNumber} already exists!`,
    });
  }

  // Update the supplier fields
  if (tradeName !== undefined) supplier.tradeName = tradeName;
  if (legalName !== undefined) supplier.legalName = legalName;
  if (country !== undefined) supplier.country = country;
  if (region !== undefined) supplier.region = region;
  if (city !== undefined) supplier.city = city;
  if (address !== undefined) supplier.address = address;
  if (postCode !== undefined) supplier.postCode = postCode;
  if (email !== undefined) supplier.email = email;
  if (phoneNumber !== undefined) supplier.phoneNumber = phoneNumber;
  if (taxNumber !== undefined) supplier.taxNumber = taxNumber;
  if (contactPerson !== undefined) supplier.contactPerson = contactPerson;
  if (supplierGoods !== undefined) supplier.supplierGoods = supplierGoods;

  // Save the updated supplier
  const updatedSupplier = await supplier.save();

  if (updatedSupplier) {
    return res
      .status(200)
      .json({
        message: `Supplier ${supplier.legalName} updated successfully!`,
      });
  } else {
    return res.status(500).json({ message: "Failed to update supplier!" });
  }
});

// @desc    Delete supplier
// @route   DELETE /supplier/:id
// @access  Private
const deleteSupplier = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // fetch the supplier with the given ID
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    return res.status(404).json({ message: "Supplier not found!" });
  }

  // delete all supplier goods related to the supplier
  await SupplierGood.deleteMany({ supplier: id });

  // delete the supplier
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
