const Location = require('../models/location');

const handleErrors = (err) => {
  let errors = { email: '', name: '', contact: '', address: '' };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = `${Object.values(err.keyValue)[0]} already exist`;
    return errors;
  }

  return errors;
};

exports.create = async (req, res) => {
  try {
    const { country, region, city } = req.body;
    const location = new Location({
      country,
      region,
      city,
    });
    await location.save();
    return res.status(201).json({
      message: 'new location successfully added',
      success: true,
    });
  } catch (error) {
    const errors = handleErrors(error);
    return res.status(500).json({
      errors,
      success: false,
    });
  }
};

exports.form = async (req, res) => {
  res.render('newLocation');
};

exports.update = async (req, res) => {
  //
};

exports.remove = async (req, res) => {
  //
};
