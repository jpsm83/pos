const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Business = require("../models/Business");
const User = require("../models/User");
const Pos = require("../models/Pos");
const Supplier = require("../models/Supplier");
const BusinessGood = require("../models/BusinessGood");
const SupplierGood = require("../models/SupplierGood");
const Order = require("../models/Order");
const Printer = require("../models/Printer");

// @desc    Get all businesses
// @route   GET /business
// @access  Private
const getBusinesses = asyncHandler(async (req, res) => {
  // fetch all businesses and exclude the password field
  const businesses = await Business.find().select("-password").lean();
  // if no businesses are found, return a 404 status code with a message
  if (!businesses?.length) {
    return res.status(404).json({ message: "No businesses found!" });
  }
  //return the businesses
  res.json(businesses);
});

// @desc    Get business by ID
// @route   GET /business/:id
// @access  Private
const getBusinessById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch the business with the given ID and exclude the password field
  const business = await Business.findById(id).select("-password").lean();
  // if the business is not found, return a 404 status code with a message
  if (!business) {
    return res.status(404).json({ message: "Business not found!" });
  }
  // return the business
  res.json(business);
});

// @desc    Create new business
// @route   POST /business
// @access  Private
const createNewBusiness = asyncHandler(async (req, res) => {
  const {
    tradeName,
    legalName,
    email,
    password,
    country,
    region,
    city,
    address,
    postCode,
    phoneNumber,
    taxNumber,
    contactPerson,
    subscription,
  } = req.body;

  // check required fields
  if (
    !tradeName ||
    !legalName ||
    !email ||
    !password ||
    !country ||
    !city ||
    !address ||
    !postCode ||
    !phoneNumber ||
    !taxNumber ||
    !subscription
  ) {
    return res.status(400).json({
      message:
        "TradeName, legalName, email, password, country, city, address, postCode, phoneNumber, taxNumber and subscription are required!",
    });
  }

  // check for duplicate legalName, email or taxNumber
  const duplicateBusiness = await Business.findOne({
    $or: [{ legalName }, { email }, { taxNumber }],
  }).lean();

  if (duplicateBusiness) {
    return res.status(409).json({
      message: `Business ${legalName}, ${email} or ${taxNumber} already exists!`,
    });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create business object with required fields
  const businessObj = {
    tradeName,
    legalName,
    email,
    password: hashedPassword,
    country,
    city,
    address,
    postCode,
    phoneNumber,
    taxNumber,
    subscription,
  };

  // conditionally add non-required fields if they exist
  if (region) businessObj.region = region;
  if (contactPerson) businessObj.contactPerson = contactPerson;

  // create the business
  const business = await Business.create(businessObj);

  if (business) {
    res
      .status(201)
      .json({ message: `Business ${legalName} created successfully!` });
  } else {
    res.status(500).json({ message: "Failed to create business!" });
  }
});

// @desc    Update business
// @route   PATH /business/:id
// @access  Private
const updateBusiness = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    tradeName,
    legalName,
    email,
    password,
    country,
    region,
    city,
    address,
    postCode,
    phoneNumber,
    taxNumber,
    contactPerson,
    subscription,
  } = req.body;

  // check required fields
  if (
    !tradeName ||
    !legalName ||
    !email ||
    !password ||
    !country ||
    !city ||
    !address ||
    !postCode ||
    !phoneNumber ||
    !taxNumber ||
    !subscription
  ) {
    return res.status(400).json({
      message:
        "TradeName, legalName, email, password, country, city, address, postCode, phoneNumber, taxNumber and subscription are required!",
    });
  }

  // check business exists
  const business = await Business.findById(id);
  if (!business) {
    return res.status(404).json({ message: "Business not found!" });
  }

  // check for duplicate legalName, email or taxNumber
  const duplicateBusiness = await Business.findOne({
    _id: { $ne: id },
    $or: [{ legalName }, { email }, { taxNumber }],
  }).lean();

  if (duplicateBusiness) {
    return res.status(409).json({
      message: `Business ${legalName}, ${email} or ${taxNumber} already exists!`,
    });
  }

  // update the business object
  if (tradeName !== undefined) business.tradeName = tradeName;
  if (legalName !== undefined) business.legalName = legalName;
  if (email !== undefined) business.email = email;
  if (country !== undefined) business.country = country;
  if (city !== undefined) business.city = city;
  if (address !== undefined) business.address = address;
  if (postCode !== undefined) business.postCode = postCode;
  if (phoneNumber !== undefined) business.phoneNumber = phoneNumber;
  if (taxNumber !== undefined) business.taxNumber = taxNumber;
  if (contactPerson !== undefined) business.contactPerson = contactPerson;
  if (subscription !== undefined) business.subscription = subscription;

  // if password is provided, hash it
  if (password !== undefined) {
    business.password = await bcrypt.hash(password, 10);
  }

  // conditionally add non-required fields if they exist
  if (region !== undefined) business.region = region;
  if (contactPerson !== undefined) business.contactPerson = contactPerson;

  // save the updated business
  const updatedBusiness = await business.save();

  if (updatedBusiness) {
    res.json({ message: `Business ${legalName} updated successfully!` });
  } else {
    res.status(500).json({ message: "Failed to update business!" });
  }
});

// @desc    Delete business
// @route   DELETE /business/:id
// @access  Private
const deleteBusiness = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // fetch the business with the given ID
  const business = await Business.findById(id);

  // if the business is not found, return a 404 status code with a message
  if (!business) {
    return res.status(404).json({ message: "Business not found!" });
  }

  // delete all related data
  await User.deleteMany({ business: id });
  await Pos.deleteMany({ business: id });
  await Supplier.deleteMany({ business: id });
  await BusinessGood.deleteMany({ business: id });
  await Order.deleteMany({ business: id });
  await Printer.deleteMany({ business: id });
  await SupplierGood.deleteMany({ business: id });

  // delete the business
  await business.deleteOne();

  res.json({ message: `Business ${business.tradeName} deleted successfully!` });
});

// export controller functions
module.exports = {
  getBusinesses,
  getBusinessById,
  createNewBusiness,
  updateBusiness,
  deleteBusiness,
};
