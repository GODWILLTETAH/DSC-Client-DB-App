const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

const verifyToken = (req, res, next) => {
  const token =
    req.cookies.jwt ||
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect('/signin');
      } else {
        req.profile = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/signin');
  }
};

const checkUser = async (req, res, next) => {
  try {
    const userId = req.profile._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.profile = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.profile.role === role) {
      next();
    } else {
      res.render('error');
    }
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  verifyToken,
  checkUser,
  checkRole,
};
