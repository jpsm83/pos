const asyncHandler = require("express-async-handler");
const SupplierGood = require("../models/SupplierGood");
const BusinessGood = require("../models/BusinessGood");

// @desc    Get all supplier goods
// @route   GET /supplierGoods
// @access  Private
const getSupplierGoods = asyncHandler(async (req, res) => {
  // fetch all suppliers goods
  const supplierGoods = await SupplierGood.find().lean();
  // if no supplier goods are found, return a 404 status code with a message
  if (!supplierGoods.length) {
    return res.status(404).json({ message: "No supplier goods found!" });
  }
  //return the supplier goods
  res.json(supplierGoods);
});

// @desc    Get supplier good by ID
// @route   GET /supplierGoods/:id
// @access  Private
const getSupplierGoodById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch the supplier good with the given ID
  const supplierGood = await SupplierGood.findById(id).lean();
  // if the supplier good is not found, return a 404 status code with a message
  if (!supplierGood) {
    return res.status(404).json({ message: "Supplier good not found!" });
  }
  // Return the supplier good
  res.json(supplierGood);
});

// @desc    Get supplier goods by supplier ID
// @route   GET /supplierGoods/supplier/:id
// @access  Private
const getSupplierGoodsBySupplierId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch supplier goods with the given supplier ID
  const supplierGoods = await SupplierGood.find({ supplier: id }).lean();
  // if no supplier goods are found, return a 404 status code with a message
  if (!supplierGoods.length) {
    return res.status(404).json({ message: "No supplier goods found!" });
  }
  // return the supplier goods
  res.json(supplierGoods);
});

// @desc    Create new supplier good
// @route   POST /supplierGoods
// @access  Private
const createNewSupplierGood = asyncHandler(async (req, res) => {
  const {
    name,
    keyword,
    description,
    category,
    image,
    measurementType,
    measurementUnit,
    measurementValue,
    wholePrice,
    pricePerMeasurementUnit,
    virtualQuantityAvailable,
    realQuantityAvailable,
    minimunQuantityRequired,
    currentlyInUse,
    supplier,
    business,
  } = req.body;

  // check required fields
  if (
    !name ||
    !keyword ||
    !category ||
    currentlyInUse === undefined ||
    !supplier ||
    !business
  ) {
    return res.status(400).json({
      message:
        "Name, keyword, category, currentlyInUse, supplier and business are required!",
    });
  }

  // check if the supplier good already exists
  const duplicateSupplierGood = await SupplierGood.findOne({
    business: business,
    name,
  }).lean();
  if (duplicateSupplierGood) {
    return res
      .status(400)
      .json({ message: `${name} already exists on supplier goods!` });
  }

  // Create a supplier good object with required fields
  const supplierGoodObj = {
    name,
    keyword,
    category,
    currentlyInUse,
    supplier,
    business,
  };

  // conditionally add non-required fields if they exist
  if (description) supplierGoodObj.description = description;
  if (image) supplierGoodObj.image = image;
  if (measurementType) supplierGoodObj.measurementType = measurementType;
  if (measurementUnit) supplierGoodObj.measurementUnit = measurementUnit;
  if (measurementValue) supplierGoodObj.measurementValue = measurementValue;
  if (wholePrice) supplierGoodObj.wholePrice = wholePrice;
  if (pricePerMeasurementUnit)
    supplierGoodObj.pricePerMeasurementUnit = pricePerMeasurementUnit;
  if (virtualQuantityAvailable)
    supplierGoodObj.virtualQuantityAvailable = virtualQuantityAvailable;
  if (realQuantityAvailable)
    supplierGoodObj.realQuantityAvailable = realQuantityAvailable;
  if (minimunQuantityRequired)
    supplierGoodObj.minimunQuantityRequired = minimunQuantityRequired;

  // create a new supplier good
  const supplierGood = await SupplierGood.create(supplierGoodObj);

  if (supplierGood) {
    res
      .status(201)
      .json({ message: `Supplier good ${name} created successfully!` });
  } else {
    res.status(500).json({ message: "Failed to create supplier good!" });
  }
});

// @desc    Update supplier good by ID
// @route   PUT /supplierGoods/:id
// @access  Private
const updateSupplierGood = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    keyword,
    description,
    category,
    image,
    measurementType,
    measurementUnit,
    measurementValue,
    wholePrice,
    pricePerMeasurementUnit,
    virtualQuantityAvailable,
    realQuantityAvailable,
    minimunQuantityRequired,
    currentlyInUse,
  } = req.body;

  // check required fields
  if (!name || !keyword || !category || currentlyInUse === undefined) {
    return res.status(400).json({
      message:
        "Name, keyword, category, currentlyInUse, supplier and business are required!",
    });
  }

  // check if the supplier good exists
  const supplierGood = await SupplierGood.findById(id);
  if (!supplierGood) {
    return res.status(404).json({ message: "Supplier good not found!" });
  }

  // check for duplicates supplier good name
  const duplicateSupplierGood = await SupplierGood.findOne({
    _id: { $ne: id },
    business: supplierGood.business,
    name,
  }).lean();
  if (duplicateSupplierGood) {
    return res.status(409).json({
      message: `Supplier good ${name} already exists on this supplier!`,
    });
  }

  // Update the supplier good details
  if (name !== undefined) supplierGood.name = name;
  if (keyword !== undefined) supplierGood.keyword = keyword;
  if (description !== undefined) supplierGood.description = description;
  if (category !== undefined) supplierGood.category = category;
  if (image !== undefined) supplierGood.image = image;
  if (measurementType !== undefined)
    supplierGood.measurementType = measurementType;
  if (measurementUnit !== undefined)
    supplierGood.measurementUnit = measurementUnit;
  if (measurementValue !== undefined)
    supplierGood.measurementValue = measurementValue;
  if (wholePrice !== undefined) supplierGood.wholePrice = wholePrice;
  if (pricePerMeasurementUnit !== undefined)
    supplierGood.pricePerMeasurementUnit = pricePerMeasurementUnit;
  if (virtualQuantityAvailable !== undefined)
    supplierGood.virtualQuantityAvailable = virtualQuantityAvailable;
  if (realQuantityAvailable !== undefined)
    supplierGood.realQuantityAvailable = realQuantityAvailable;
  if (minimunQuantityRequired !== undefined)
    supplierGood.minimunQuantityRequired = minimunQuantityRequired;
  if (currentlyInUse !== undefined)
    supplierGood.currentlyInUse = currentlyInUse;

  // save the updated supplier good
  const updatedSupplierGood = await supplierGood.save();

  if (updatedSupplierGood) {
    res.json({ message: `Supplier good ${name} updated successfully!` });
  } else {
    res.status(500).json({ message: "Failed to update supplier good!" });
  }
});

// @desc    Delete supplier good by ID
// @route   DELETE /supplierGoods/:id
// @access  Private
const deleteSupplierGood = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch the supplier good with the given ID
  const supplierGood = await SupplierGood.findById(id);

  // if the supplier good is not found, return a 404 status code with a message
  if (!supplierGood) {
    return res.status(404).json({ message: "Supplier good not found!" });
  }

  // check if the supplier good is in use
  const businessGoodUsingSupplierGood = await BusinessGood.find({
    supplierGoods: { $elemMatch: { supplierGood: id } },
  }).lean();

  // delete the supplier good from the business goods that use it
  if (businessGoodUsingSupplierGood) {
    for (let businessGood of businessGoodUsingSupplierGood) {
      businessGood.supplierGoods = businessGood.supplierGoods.filter(
        (supplier) => supplier.supplierGood.toString() !== id
      );

      // fetch the businessGood as a Mongoose document
      const businessGoodDoc = await BusinessGood.findById(businessGood.id);
      businessGoodDoc.supplierGoods = businessGood.supplierGoods;
      await businessGoodDoc.save();
    }
  }

  // delete the supplier good
  await supplierGood.deleteOne();

  res.json({
    message: `Supplier good ${supplierGood.name} deleted successfully!`,
  });
});

module.exports = {
  getSupplierGoods,
  getSupplierGoodById,
  getSupplierGoodsBySupplierId,
  createNewSupplierGood,
  updateSupplierGood,
  deleteSupplierGood,
};
