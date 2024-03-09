const User = require("../models/User");
const Pos = require("../models/Pos");
const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc    Get all users
// @route   GET /users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(404).json({ message: "No users found!" });
  }
  res.json(users);
});

// @desc    Create new user
// @route   POST /users
// @access  Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, email, password, role, firstName, lastName, phoneNumber } =
    req.body;

  // confirm data is not missing
  if (
    !username ||
    !email ||
    !password ||
    !role ||
    !firstName ||
    !lastName ||
    !phoneNumber
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // check for duplcates
  const duplicateUser = await User.findOne({ username }).lean().exec();

  if (duplicateUser) {
    return res.status(409).json({ message: "Username already exists!" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userObj = new User({
    username,
    email,
    password: hashedPassword,
    role,
    firstName,
    lastName,
    phoneNumber,
  });

  // create user
  const user = await User.create(userObj);

  // confirm user was created
  if (user) {
    return res
      .status(201)
      .json({ message: `New user ${userObj.username} created successfully!` });
  } else {
    return res.status(400).json({ message: "User creation failed!" });
  }
});

// @desc    Update user
// @route   PATCH /users
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const {
    id,
    username,
    email,
    password,
    role,
    firstName,
    lastName,
    phoneNumber,
  } = req.body;

  // confirm data is not missing
  if ((!id, !username, !email, !role, !firstName, !lastName, !phoneNumber)) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // check for user
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  // check for duplcates
  const duplicateUser = await User.findOne({ username }).lean().exec();
  if (duplicateUser && duplicateUser._id.toString() !== id) {
    return res.status(409).json({ message: "Username already exists!" });
  }

  user.username = username;
  user.email = email;
  user.role = role;
  user.firstName = firstName;
  user.lastName = lastName;
  user.phoneNumber = phoneNumber;

  // if password is provided, hash it
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updateUser = await user.save();

  res.json({ message: `User ${updateUser.username} updated successfully!` });
});

// @desc    Delete user
// @route   DELETE /users
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required!" });
  }

  const order = await Order.findOne({ user: id, billingStatus: "Open" })
    .lean()
    .exec();

  if (order) {
    return res.status(400).json({ message: "User has open orders!" });
  }

  const pos = await Pos.findOne({ openedBy: id, status: { $ne: "Closed" } })
    .lean()
    .exec();

  if (pos) {
    return res.status(400).json({ message: "User has open POSs!" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  await user.deleteOne();

  const reply = `User ${user.username} with ID ${user._id} deleted successfully!`;

  res.json(reply);
});

module.exports = { getUsers, createNewUser, updateUser, deleteUser };