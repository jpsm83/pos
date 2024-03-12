const asyncHandler = require("express-async-handler");
const Pos = require("../models/Pos");
const Order = require("../models/Order");

// @desc    Get all pos
// @route   GET /pos
// @access  Private
const getPos = asyncHandler(async (req, res) => {
  const pos = await Pos.find().lean();
  if (!pos?.length) {
    return res.status(404).json({ message: "No pos found!" });
  }
  res.json(pos);
});

// @desc    Get pos by ID
// @route   GET /pos/:id
// @access  Private
const getPosById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pos = await Pos.findById(id).lean().exec();

  if (!pos.length) {
    return res.status(404).json({ message: "Pos not found!" });
  }

  res.json(pos);
});

// @desc    Create new pos
// @route   POST /pos
// @access  Private
const createNewPos = asyncHandler(async (req, res) => {
  const { openedAt, guests, posNumber, status, business, openedBy } = req.body;

  // confirm data is not missing
  if (!openedAt || !guests || !posNumber || !status || !business || !openedBy) {
    return res.status(400).json({
      message:
        "OpenedAt, guests, posNumber, status, business and openedBy are required!",
    });
  }

  // check for duplcates
  const duplicatePos = await Pos.findOne({
    posNumber,
    status: { $ne: "Closed" },
  })
    .lean()
    .exec();

  if (duplicatePos) {
    return res.status(409).json({ message: "Pos already exists and it is opened!" });
  }

  const posObj = {
    openedAt,
    guests,
    posNumber,
    status,
    business,
    openedBy,
  };

  const newPos = await Pos.create(posObj);

  if (newPos) {
    return res
      .status(201)
      .json({ message: `Pos ${posNumber} created successfully!` });
  } else {
    return res.status(500).json({ message: "Pos creation failed!" });
  }
});

// @desc    Update pos
// @route   PUT /pos/:id
// @access  Private
const updatePos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { closedAt, clientName, status, closedBy, orders } = req.body;
  console.log(req.body);
  try {
    // Check for pos
    const pos = await Pos.findById(id);

    if (!pos) {
      return res.status(404).json({ message: "Pos not found!" });
    }

    pos.clientName = clientName ? clientName : pos.clientName;
    pos.status = status ? status : pos.status;
    pos.orders = orders ? orders : pos.orders;

    // Check if there are open orders before closing the pos
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
      // For closed status, ensure closedAt and closedBy are provided
      if (!closedAt || !closedBy) {
        return res.status(400).json({
          message: "ClosedAt and closedBy are required to close a POS!",
        });
      }
      pos.status = "Closed";
      pos.closedAt = closedAt;
      pos.closedBy = closedBy;
    }

    // Save and return the updated pos
    await pos.save();

    res.json({ message: `Pos ${pos.posNumber} updated successfully!` });
  } catch (error) {
    console.error("Error updating POS:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// @desc    Delete pos
// @route   DELETE /pos/:id
// @access  Private
const deletePos = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Pos ID is required!" });
    }

    const posToDelete = await Pos.findById(id).exec();

    await posToDelete.deleteOne();

    const reply = `Pos ${posToDelete.posNumber} deleted successfully!`;

    res.json(reply);
  } catch (error) {
    console.error("Error deleting POS:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = {
  getPos,
  getPosById,
  createNewPos,
  updatePos,
  deletePos,
};
