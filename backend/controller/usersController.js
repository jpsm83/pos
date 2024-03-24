const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Pos = require("../models/Pos");
const Order = require("../models/Order");

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

// @desc    Get user by ID
// @route   GET /users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password").lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.json(user);
});

// @desc   Get user by bussiness ID
// @route  GET /users/business/:id
// @access Private
const getUsersByBusinessId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const users = await User.find({ business: id })
    .select("-password")
    .lean()
    .exec();

  if (!users) {
    return res.status(404).json({ message: "No users found!" });
  }

  res.json(users);
});

// @desc    Create new user
// @route   POST /users
// @access  Private
const createNewUser = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    firstName,
    lastName,
    phoneNumber,
    active,
    onDuty,
    business,
  } = req.body;

  // confirm data is not missing
  if (
    !username ||
    !email ||
    !password ||
    !role ||
    !firstName ||
    !lastName ||
    !phoneNumber ||
    active === undefined ||
    onDuty === undefined ||
    !business
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

  const userObj = {
    username,
    email,
    password: hashedPassword,
    role,
    firstName,
    lastName,
    phoneNumber,
    active,
    onDuty,
    business,
  };

  // create user
  const newUser = await User.create(userObj);

  // confirm user was created
  if (newUser) {
    return res
      .status(201)
      .json({ message: `New user ${userObj.username} created successfully!` });
  } else {
    return res.status(400).json({ message: "Failed to create User!" });
  }
});

// @desc    Update user
// @route   PATCH /users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    username,
    photo,
    password,
    role,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    joinDate,
    contractHoursWeek,
    monthlySalary,
    terminateDate,
    active,
    onDuty,
  } = req.body;

  // confirm data is not missing
  if (
    (!username,
    !role,
    !firstName,
    !lastName,
    !email,
    !phoneNumber,
    !joinDate,
    active === undefined,
    onDuty === undefined)
  ) {
    return res.status(400).json({
      message:
        "Username, role, firstName, lastName, email, phoneNumber, joinDate, active and onDuty are required!",
    });
  }

  // check for user
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  // check for duplicates username
  const newUsernameAlreadyExist = await User.findOne({
    _id: { $ne: id },
    username,
  })
    .lean()
    .exec();

  if (newUsernameAlreadyExist) {
    return res.status(409).json({
      message: `Username ${username} already exists!`,
    });
  }

  user.username = username || user.username;
  user.photo = photo || user.photo;
  user.role = role || user.role;
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.address = address || user.address;
  user.joinDate = joinDate || user.joinDate;
  contractHoursWeek = contractHoursWeek || contractHoursWeek;
  monthlySalary = monthlySalary || monthlySalary;
  user.terminateDate = terminateDate || user.terminateDate;
  user.active = active;
  user.onDuty = onDuty;

  // if password is provided, hash it
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updateUser = await user.save();

  res.json({ message: `User ${updateUser.username} updated successfully!` });
});

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

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

module.exports = {
  getUsers,
  getUserById,
  getUsersByBusinessId,
  createNewUser,
  updateUser,
  deleteUser,
};
