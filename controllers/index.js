const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Clients = require("../models/clients");

const Location = require("../models/location");

const { hashPassword, comparePassword } = require("../helpers/auth");

const handleErrors = (err) => {
  let errors = { email: "", name: "", contact: "", address: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = `${Object.values(err.keyValue)[0]} already exist`;
    return errors;
  }

  return errors;
};

exports.form = async (req, res) => {
  try {
    const cities = await Location.find({}).sort({ _id: -1 });
    res.render("index", { cities, profile: req.profile });
  } catch (err) {
    console.log(err);
  }
};

exports.dataTable = async (req, res) => {
  res.render("data", { profile: req.profile });
};

exports.admin = async (req, res) => {
  try {
    const [userCount, clientCount] = await Promise.all([
      User.countDocuments({}),
      Clients.countDocuments({}),
    ]);

    res.render("admin", { profile: req.profile, userCount, clientCount });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.signup = async (req, res) => {
  res.render("signup");
};
exports.loginForm = async (req, res) => {
  res.render("login");
};
exports.newUser = async (req, res) => {
  try {
    const { name, email, password, role, date } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      date,
    });

    await user.save();
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    //res.cookie("jwt", token, { httpOnly: true });
    user.token = token;

    return res.status(201).json({
      message: "user successfully added",
      success: true,
      data: user,
      token,
    });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(500).json({
      errors,
      success: false,
    });
  }
};

exports.updateOne = async (req, res) => {
  try {
    // const userId = req.params.id;
    // const updateData = { ...req.body };

    const userId = req.params.id;
    const { name, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);

    const updateData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    };

    const updatedClient = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedClient) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedClient,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.editOne = async (req, res) => {
  //const id = new ObjectId(req.params.id);
  const id = req.params.id;

  try {
    const doc = await User.findById(id);
    res.render("editUser", { records: doc });
  } catch (err) {
    console.log(err);
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong user or password",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, { httpOnly: true });
    user.token = token;

    user.password = undefined;
    user.secret = undefined;

    const isWebClient = req.headers["user-agent"].includes("Mozilla");

    if (isWebClient) {
      res.status(200).json({ token, user });
    } else {
      res.status(200).json({ token, user });
    }
  } catch (err) {
    //console.log(err);
    //return res.status(400).send('Error. Try again.');
    return res.status(400).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

exports.getAll = async (req, res) => {
  try {
    const records = await User.find({}).sort({ _id: -1 });
    return res.status(201).json({
      success: true,
      data: records,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

exports.deleteOne = async (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(res.redirect("/admin"))
    .catch((err) => {
      console.log(err);
    });
};
