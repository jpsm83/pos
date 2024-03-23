const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Business = require("../models/Business");
const User = require("../models/User");
const Pos = require("../models/Pos");
const Supplier = require("../models/Supplier");
const BusinessGood = require("../models/BusinessGood");
const SupplierGood = require("../models/SupplierGood");

// @desc    Get all businesses
// @route   GET /business
// @access  Private
const getBusinesses = asyncHandler(async (req, res) => {
  const businesses = await Business.find().select("-password").lean();
  if (!businesses?.length) {
    return res.status(404).json({ message: "No businesses found!" });
  }
  res.json(businesses);
});

// @desc    Get business by ID
// @route   GET /business/:id
// @access  Private
const getBusinessById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const business = await Business.findById(id)
    .select("-password")
    .lean()
    .exec();

  if (!business) {
    return res.status(404).json({ message: "Business not found!" });
  }

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
  } = req.body;

  // confirm data is not missing
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
    !contactPerson
  ) {
    return res
      .status(400)
      .json({
        message:
          "TradeName, legalName, email, password, country, city, address, postCode, phoneNumber, taxNumber and contactPerson are required!",
      });
  }

  // check for duplcates
  const duplicateBusiness = await Business.findOne({ tradeName }).lean().exec();

  if (duplicateBusiness) {
    return res.status(409).json({ message: "Business name already exists!" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const businessObj = {
    tradeName,
    legalName,
    email,
    password: hashedPassword,
    country,
    region,
    city,
    address,
    postCode,
    phoneNumber,
    taxNumber,
    contactPerson,
  };

  // create business
  const newBusiness = await Business.create(businessObj);

  if (newBusiness) {
    res
      .status(201)
      .json({ message: `Business ${tradeName} created successfully!` });
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
  } = req.body;

  // confirm data is not missing
  if (
    !id ||
    !tradeName ||
    !legalName ||
    !email ||
    !country ||
    !city ||
    !address ||
    !postCode ||
    !phoneNumber ||
    !taxNumber ||
    !contactPerson
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // check for business
  const business = await Business.findById(id).exec();

  if (!business) {
    return res.status(404).json({ message: "Business not found!" });
  }

  // check for duplcates
  const duplicateBusiness = await Business.findOne({ tradeName }).lean().exec();
  if (duplicateBusiness && duplicateBusiness._id.toString() !== id) {
    return res.status(409).json({ message: "Business name already exists!" });
  }

  business.tradeName = tradeName || business.tradeName;
  business.legalName = legalName || business.legalName;
  business.email = email || business.email;
  business.country = country || business.country;
  business.city = city || business.city;
  business.address = address || business.address;
  business.postCode = postCode || business.postCode;
  business.phoneNumber = phoneNumber || business.phoneNumber;
  business.taxNumber = taxNumber || business.taxNumber;
  business.contactPerson = contactPerson || business.contactPerson;

  // if password is provided, hash it
  if (password) {
    business.password = await bcrypt.hash(password, 10);
  }

  if (region || business.region) business.region = region || business.region;

  const updatedBusiness = await business.save();

  res.json({
    message: `Business ${updatedBusiness.tradeName} updated successfully!`,
  });
});

// @desc    Delete business
// @route   DELETE /business/:id
// @access  Private
const deleteBusiness = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Business ID is required!" });
    }

    const business = await Business.findById(id).exec();

    if (!business) {
      return res.status(404).json({ message: "Business not found!" });
    }

    // Function to delete children data
    const deleteChildrenData = async (
      childrenModel,
      propertyToFind,
      propertyId
    ) => {
      await childrenModel.deleteMany({ [propertyToFind]: propertyId }).exec();
    };

    // Delete suppliers related data
    const suppliersIds = business.suppliers;
    if (suppliersIds.length > 0) {
      for (let i = 0; i < suppliersIds.length; i++) {
        await deleteChildrenData(SupplierGood, "supplier", suppliersIds[i]);
      }
    }

    // Fetch all suppliers related to the business
    const suppliers = await Supplier.find({ business: id });

    // Delete all supplier goods related to these suppliers
    for (let supplier of suppliers) {
      await SupplierGood.deleteMany({ supplier: supplier.id });
    }

    // Delete all related data
    await User.deleteMany({ business: id }).exec();
    await Pos.deleteMany({ business: id }).exec();
    await Supplier.deleteMany({ business: id }).exec();
    await BusinessGood.deleteMany({ business: id }).exec();

    await business.deleteOne();

    const reply = `Business ${business.tradeName} deleted successfully!`;

    res.json(reply);
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({ message: "Error deleting business" });
  }
});

module.exports = {
  getBusinesses,
  getBusinessById,
  createNewBusiness,
  updateBusiness,
  deleteBusiness,
};
