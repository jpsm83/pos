const asyncHandler = require("express-async-handler");
const BusinessGood = require("../models/BusinessGood");

// @desc    Get all business goods
// @route   GET /businessGoods
// @access  Private
const getBusinessGoods = asyncHandler(async (req, res) => {
  // fetch all business goods
  const businessGoods = await BusinessGood.find().lean();
  // if no business goods are found, return a 404 status code with a message
  if (!businessGoods.length) {
    return res.status(404).json({ message: "No business goods found!" });
  }
  // return the business goods
  res.json(businessGoods);
});

// @desc    Get business good by ID
// @route   GET /businessGoods/:id
// @access  Private
const getBusinessGoodById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch the business good with the given ID
  const businessGood = await BusinessGood.findById(id).lean();
  // if the business good is not found, return a 404 status code with a message
  if (!businessGood) {
    return res.status(404).json({ message: "Business good not found!" });
  }
  // return the business good
  res.json(businessGood);
});

// @desc    Get business goods by business ID
// @route   GET /businessGoods/business/:id
// @access  Private
const getBusinessGoodsByBusinessId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch business goods with the given business ID
  const businessGoods = await BusinessGood.find({ business: id }).lean();
  // if no business goods are found, return a 404 status code with a message
  if (!businessGoods.length) {
    return res.status(404).json({ message: "No business goods found!" });
  }
  // return the business goods
  res.json(businessGoods);
});

// @desc    Create new business good
// @route   POST /businessGoods
// @access  Private
const createNewBusinessGood = asyncHandler(async (req, res) => {
  const {
    name,
    keyword,
    description,
    category,
    subCategory,
    image,
    available,
    quantityAvailable,
    manufacturingCost,
    sellingPrice,
    supplierGoods,
    business,
  } = req.body;

  // check required fields
  if (
    !name ||
    !keyword ||
    !category ||
    available === undefined ||
    !sellingPrice ||
    !business
  ) {
    return res.status(400).json({
      message:
        "Name, keyword, category, available, sellingPrice and business are required!",
    });
  }

  // check for duplicate business good
  const duplicateBusinessGood = await BusinessGood.findOne({
    business: business,
    name,
  }).lean();
  if (duplicateBusinessGood) {
    return res
      .status(400)
      .json({ message: `${name} already exists on business goods!` });
  }

  // create a business good object with required fields
  const businessGoodObj = {
    name,
    keyword,
    category,
    available,
    sellingPrice,
    business,
  };

  // conditionally add non-required fields if they exist
  if (description) businessGoodObj.description = description;
  if (subCategory) businessGoodObj.subCategory = subCategory;
  if (image) businessGoodObj.image = image;
  if (quantityAvailable) businessGoodObj.quantityAvailable = quantityAvailable;
  if (manufacturingCost) businessGoodObj.manufacturingCost = manufacturingCost;
  if (supplierGoods) {
    // check if supplierGoods.supplierGood are unique in the array
    const supplierGoodsSet = new Set(
      supplierGoods.map((supplier) => supplier.supplierGood)
    );
    if (supplierGoods.length !== supplierGoodsSet.size) {
      return res.status(400).json({
        message: "Supplier goods already exists on this business good!",
      });
    }

    // create supplier goods array
    businessGoodObj.supplierGoods = supplierGoods.map((supplier) => {
      let obj = {};
      obj.supplierGood = supplier.supplierGood;
      if (supplier.measurementUsed)
        obj.measurementUsed = supplier.measurementUsed;
      if (supplier.quantityNeeded) obj.quantityNeeded = supplier.quantityNeeded;
      if (supplier.quantityNeededPrice)
        obj.quantityNeededPrice = supplier.quantityNeededPrice;
      return obj;
    });
  }

  // create the business good
  const businessGood = await BusinessGood.create(businessGoodObj);

  if (businessGood) {
    res
      .status(201)
      .json({ message: `Business good ${name} created successfully!` });
  } else {
    res.status(500).json({ message: "Failed to create business good!" });
  }
});

// @desc    Update business good by ID
// @route   PUT /businessGoods/:id
// @access  Private
const updateBusinessGood = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    keyword,
    description,
    category,
    subCategory,
    image,
    available,
    quantityAvailable,
    manufacturingCost,
    sellingPrice,
    supplierGoods,
  } = req.body;

  // check required fields
  if (
    !name ||
    !keyword ||
    !category ||
    available === undefined ||
    !sellingPrice
  ) {
    return res.status(400).json({
      message:
        "Name, keyword, category, available and sellingPrice are required!",
    });
  }

  // check if the business good exists
  const businessGood = await BusinessGood.findById(id);
  if (!businessGood) {
    return res.status(404).json({ message: "Business good not found!" });
  }

  // check for duplicate names
  const duplicateBusinessGood = await BusinessGood.findOne({
    _id: { $ne: id },
    business: businessGood.business,
    name,
  }).lean();
  if (duplicateBusinessGood) {
    return res
      .status(409)
      .json({ message: `Business good ${name} already exists!` });
  }

  // update the business good fields
  if (name !== undefined) businessGood.name = name;
  if (keyword !== undefined) businessGood.keyword = keyword;
  if (description !== undefined) businessGood.description = description;
  if (category !== undefined) businessGood.category = category;
  if (subCategory !== undefined) businessGood.subCategory = subCategory;
  if (image !== undefined) businessGood.image = image;
  if (available !== undefined) businessGood.available = available;
  if (quantityAvailable !== undefined)
    businessGood.quantityAvailable = quantityAvailable;
  if (manufacturingCost !== undefined)
    businessGood.manufacturingCost = manufacturingCost;
  if (sellingPrice !== undefined) businessGood.sellingPrice = sellingPrice;

  // check if supplierGoods exist and update the supplier goods array
  if (supplierGoods !== undefined && supplierGoods.length > 0) {
    const supplierGoodsSet = new Set(
      supplierGoods.map((supplier) => supplier.supplierGood)
    );
    // check if supplierGoods.supplierGood are unique in the array
    if (supplierGoods.length !== supplierGoodsSet.size) {
      return res.status(400).json({
        message: "Supplier goods already exist on this business good!",
      });
    }
    // update supplier goods array
    businessGood.supplierGoods = supplierGoods.map((supplier) => {
      let obj = {};
      obj.supplierGood = supplier.supplierGood;
      if (supplier.measurementUsed)
        obj.measurementUsed = supplier.measurementUsed;
      if (supplier.quantityNeeded) obj.quantityNeeded = supplier.quantityNeeded;
      if (supplier.quantityNeededPrice)
        obj.quantityNeededPrice = supplier.quantityNeededPrice;
      return obj;
    });
  }

  // save the updated business good
  const updatedBusinessGood = await businessGood.save();

  if (updatedBusinessGood) {
    res.json({ message: `Business good ${name} updated successfully!` });
  } else {
    res.status(500).json({ message: "Failed to update business good!" });
  }
});

// @desc    Delete business good by ID
// @route   DELETE /businessGoods/:id
// @access  Private
const deleteBusinessGood = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch the business good with the given ID
  const businessGood = await BusinessGood.findById(id);

  // if no business good is found, return a 404 status code with a message
  if (!businessGood) {
    return res.status(404).json({ message: "Business good not found!" });
  }

  // delete the business good
  await businessGood.deleteOne();

  res.json({
    message: `Business good ${businessGood.name} deleted successfully!`,
  });
});

// export controller functions
module.exports = {
  getBusinessGoods,
  getBusinessGoodById,
  getBusinessGoodsByBusinessId,
  createNewBusinessGood,
  updateBusinessGood,
  deleteBusinessGood,
};
