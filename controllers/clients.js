const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const Clients = require("../models/clients");
const Locations = require("../models/location");

const excelJS = require("exceljs");

const handleErrors = (err) => {
  let errors = { email: "", name: "", contact: "", address: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = `${Object.values(err.keyValue)[0]} already exist`;
    return errors;
  }

  return errors;
};

exports.addOne = async (req, res) => {
  const { nom, address, email, contact, count, location } = req.body;
  try {
    const client = new Clients({
      nom,
      address,
      email,
      contact,
      count,
      location,
      addedBy: req.profile._id,
    });
    await client.save();
    return res.status(201).json({
      message: "client successfully added",
      success: true,
      data: client,
    });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(500).json({
      errors,
      success: false,
    });
  }
};

exports.readOne = async (req, res) => {
  const id = new ObjectId(req.params.id);
  const location = await Locations.find({});
  try {
    const doc = await Clients.findById(id)
      .populate("location")
      .populate("addedBy");
    res.render("editForm", { records: doc, cities: location });
  } catch (err) {
    console.log(err);
  }
};

exports.updateOne = async (req, res) => {
  try {
    const clientId = req.params.id;
    const updateData = { ...req.body }; // Updated data from the request body

    // Use findByIdAndUpdate to update the record
    const updatedClient = await Clients.findByIdAndUpdate(
      clientId,
      updateData,
      {
        new: true, // Return the updated document
      },
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      message: "Client updated successfully",
      data: updatedClient,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.exportClients = async (req, res) => {
  const workbook = new excelJS.Workbook(); // Create a new workbook
  const worksheet = workbook.addWorksheet("Clients"); // New Worksheet
  // Column for data in excel. key must match data key
  worksheet.columns = [
    { header: "S no.", key: "s_no", width: 10 },
    { header: "Name", key: "name", width: 10 },
    { header: "Email", key: "email", width: 10 },
    { header: "Address", key: "address", width: 10 },
    { header: "contact", key: "contact", width: 10 },
    { header: "count", key: "count", width: 10 },
  ];
  const records = await Clients.find({});
  // Looping through User data
  let counter = 1;
  records.forEach((record) => {
    record.s_no = counter;
    worksheet.addRow(record); // Add data in worksheet
    counter++;
  });
  // Making first line in excel bold
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  try {
    const buffer = await workbook.xlsx.writeBuffer(); // Write to a buffer instead of a file
    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=clients.xlsx",
    });
    res.send(buffer);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const records = await Clients.find({})
      .sort({ _id: -1 })
      .populate("location");
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
  Clients.findByIdAndRemove(req.params.id)
    .then(res.redirect("/clients"))
    .catch((err) => {
      console.log(err);
    });
};
