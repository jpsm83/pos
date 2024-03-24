const asyncHandler = require("express-async-handler");
const Pos = require("../models/Pos");
const Order = require("../models/Order");

// @desc    Get all pos
// @route   GET /pos
// @access  Private
const getPos = asyncHandler(async (req, res) => {
  // fetch all pos
  const pos = await Pos.find().lean();
  // if no pos are found, return a 404 status code with a message
  if (!pos?.length) {
    return res.status(404).json({ message: "No pos found!" });
  }
  // return the pos
  res.json(pos);
});

// @desc    Get pos by ID
// @route   GET /pos/:id
// @access  Private
const getPosById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch the pos with the given ID
  const pos = await Pos.findById(id).lean();
  // if the pos is not found, return a 404 status code with a message
  if (!pos) {
    return res.status(404).json({ message: "Pos not found!" });
  }
  // return the pos
  res.json(pos);
});

// @desc   Get pos by bussiness ID
// @route  GET /pos/business/:id
// @access Private
const getPosByBusinessId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch pos with the given business ID
  const pos = await Pos.find({ business: id }).lean();
  // if no pos are found, return a 404 status code with a message
  if (!pos.length) {
    return res.status(404).json({ message: "No pos found!" });
  }
  // return the pos
  res.json(pos);
});

// @desc    Create new pos
// @route   POST /pos
// @access  Private
const createNewPos = asyncHandler(async (req, res) => {
  const { guests, clientName, posReferenceCode, status, business, openedBy } =
    req.body;

  // check required fields
  if (!posReferenceCode || !status || !business || !openedBy) {
    return res.status(400).json({
      message: "PosNumber, status, business and openedBy are required!",
    });
  }

  // check for pos already exists
  const duplicatePos = await Pos.findOne({
    posReferenceCode,
    business: business,
    status: { $ne: "Closed" },
  }).lean();

  if (duplicatePos) {
    return res.status(409).json({
      message: `Pos ${posReferenceCode} already exists and it is not closed!`,
    });
  }

  // create a pos object with required fields
  const posObj = {
    posReferenceCode,
    status,
    business,
    openedBy,
  };

  // conditionally add non-required fields if they exist
  if (guests) posObj.guests = guests;
  if (clientName) posObj.clientName = clientName;

  // create the pos
  const pos = await Pos.create(posObj);

  if (pos) {
    return res
      .status(201)
      .json({ message: `Pos ${posReferenceCode} created successfully!` });
  } else {
    return res.status(500).json({ message: "Pos creation failed!" });
  }
});

// @desc    Update pos
// @route   PATCH /pos/:id
// @access  Private
const updatePos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    closedAt,
    guest,
    clientName,
    posReferenceCode,
    status,
    closedBy,
    orders,
  } = req.body;

  // check required fields
  if (!posReferenceCode || !status || !business || !openedBy) {
    return res.status(400).json({
      message: "PosNumber, status, business and openedBy are required!",
    });
  }

  // check if pos exists
  const pos = await Pos.findById(id);
  if (!pos) {
    return res.status(404).json({ message: "Pos not found!" });
  }

  // check for duplicates posReferenceCode
  const duplicatePosReferenceCode = await Pos.findOne({
    _id: { $ne: id },
    posReferenceCode,
    business: pos.business,
    status: { $ne: "Closed" },
  }).lean();
  if (duplicatePosReferenceCode) {
    return res
      .status(409)
      .json({
        message: `Pos ${posReferenceCode} already exists and it is not closed!`,
      });
  }

  // update pos fields
  if (guest !== undefined) pos.guests = guest;
  if (clientName !== undefined) pos.clientName = clientName;
  if (posReferenceCode !== undefined) pos.posReferenceCode = posReferenceCode;
  if (status !== undefined) pos.status = status;
  if (orders !== undefined) pos.orders = orders;

  // check if there are open orders before closing the pos
  if (status === "Closed") {
    if (pos.orders.length > 0) {
      for (let i = 0; i < pos.orders.length; i++) {
        const order = await Order.findById(pos.orders[i]);
        if (order.billingStatus === "Open") {
          return res
            .status(400)
            .json({ message: "Cannot close POS with open orders!" });
        }
      }
    }
    // for closed status, ensure closedAt and closedBy are provided
    if (!closedAt || !closedBy) {
      return res.status(400).json({
        message: "ClosedAt and closedBy are required to close a POS!",
      });
    }
    pos.status = "Closed";
    pos.closedAt = closedAt;
    pos.closedBy = closedBy;
  }

  // save the updated pos
  const updatedPos = await pos.save();

  if (updatedPos) {
    return res
      .status(200)
      .json({ message: `Pos ${posReferenceCode} updated successfully!` });
  } else {
    return res.status(500).json({ message: "Pos update failed!" });
  }
});

// @desc    Delete pos
// @route   DELETE /pos/:id
// @access  Private
const deletePos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // fetch the pos with the given ID
  const pos = await Pos.findById(id).exec();

  // check if pos has open orders
  if (pos.orders.length > 0) {
    for (let i = 0; i < pos.orders.length; i++) {
      const order = await Order.findById(pos.orders[i]);
      if (order.billingStatus === "Open") {
        return res
          .status(400)
          .json({ message: "Cannot delete POS with open orders!" });
      }
    }
  }

  // delete the pos
  await pos.deleteOne();

  res.json({ message: `Pos ${pos.posReferenceCode} deleted successfully!` });
});

// export controller functions
module.exports = {
  getPos,
  getPosById,
  getPosByBusinessId,
  createNewPos,
  updatePos,
  deletePos,
};
