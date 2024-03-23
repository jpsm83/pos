const asyncHandler = require("express-async-handler");
const Supplier = require("../models/Supplier");
const SupplierGood = require("../models/SupplierGood");

// @desc    Get all supplier goods
// @route   GET /supplierGoods
// @access  Private
const getSupplierGoods = asyncHandler(async (req, res) => {
      // Fetch all suppliers from the database
    const supplierGoods = await SupplierGood.find().lean();
    // if no supplier goods are found, return a 404 status code with a message
    if (!supplierGoods) {
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
    // Fetch the supplier good with the given ID from the database
    const supplierGood = await SupplierGood.findById(id).lean();

    if (!supplierGood) {
        // If the supplier good is not found, return a 404 status code with a message
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
    // Fetch supplier goods with the given supplier ID from the database
    const supplierGoods = await SupplierGood.find({ supplier: id }).lean();
    // if no supplier goods are found, return a 404 status code with a message
    if (!supplierGoods) {
        return res.status(404).json({ message: "No supplier goods found!" });
    }
    // Return the supplier goods
    res.json(supplierGoods);
});

// @desc    Create new supplier good
// @route   POST /supplierGoods
// @access  Private
const createNewSupplierGood = asyncHandler(async (req, res) => {
  const {
    name,
    keyword,
    category,
    measurementType,
    measurementUnit,
    measurementValue,
    wholePrice,
    virtualQuantityAvailable,
    realQuantityAvailable,
    currentlyInUse,
    supplier,
  } = req.body;

  // check if all required fields are filled
  if (
    !name ||
    !keyword ||
    !category ||
    !measurementType ||
    !measurementUnit ||
    !measurementValue ||
    !wholePrice ||
    !pricePerMeasurementUnit ||
    !virtualQuantityAvailable ||
    !realQuantityAvailable ||
    !currentlyInUse ||
    !supplier
  ) {
    return res
      .status(400)
      .json({
        message:
          "Name, keyword, category, measurementType, measurementUnit, measurementValue, wholePrice, virtualQuantityAvailable, realQuantityAvailable, currentlyInUse and supplier are required!",
      });
  }

  // check if the supplier exists
  const supplierExists = await Supplier.findOne({ name }).lean();
  if (supplierExists) {
    return res.status(400).json({ message: "Supplier good already exist!" });
  }

  // Create a new supplier good
  const supplierGood = await SupplierGood.create({
    name,
    keyword,
    category,
    measurementType,
    measurementUnit,
    measurementValue,
    wholePrice,
    virtualQuantityAvailable,
    realQuantityAvailable,
    currentlyInUse,
    supplier,
  });

  const newSupplierGood = await supplierGood.crate(supplierGood);

  if (newSupplierGood) {
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
    category,
    measurementType,
    measurementUnit,
    measurementValue,
    wholePrice,
    virtualQuantityAvailable,
    realQuantityAvailable,
    currentlyInUse,
    supplier,
    } = req.body;

    // Fetch the supplier good with the given ID from the database
    const supplierGood = await Supplier.findById(id);

    if (!supplierGood) {
        // If the supplier good is not found, return a 404 status code with a message
        return res.status(404).json({ message: "Supplier good not found!" });
    }

    // Update the supplier good details
    supplierGood.name = name || supplierGood.name;
    supplierGood.keyword = keyword || supplierGood.keyword;
    supplierGood.category = category || supplierGood.category;
    supplierGood.measurementType = measurementType || supplierGood.measurementType;
    supplierGood.measurementUnit = measurementUnit || supplierGood.measurementUnit;
    supplierGood.measurementValue = measurementValue || supplierGood.measurementValue;
    supplierGood.wholePrice = wholePrice || supplierGood.wholePrice;
    supplierGood.virtualQuantityAvailable = virtualQuantityAvailable || supplierGood.virtualQuantityAvailable;
    supplierGood.realQuantityAvailable = realQuantityAvailable || supplierGood.realQuantityAvailable;
    supplierGood.currentlyInUse = currentlyInUse || supplierGood.currentlyInUse;
    supplierGood.supplier = supplier || supplierGood.supplier;

    // Save the updated supplier good to the database
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

    // Fetch the supplier good with the given ID from the database
    const supplierGood = await SupplierGood.findById(id);

    if (!supplierGood) {
        // If the supplier good is not found, return a 404 status code with a message
        return res.status(404).json({ message: "Supplier good not found!" });
    }

    // Delete the supplier good from the database
    await supplierGood.deleteOne();

    res.json({ message: `Supplier good ${supplierGood.name} deleted successfully!` });
});

module.exports = {
    getSupplierGoods,
    getSupplierGoodById,
    getSupplierGoodsBySupplierId,
    createNewSupplierGood,
    updateSupplierGood,
    deleteSupplierGood,
};