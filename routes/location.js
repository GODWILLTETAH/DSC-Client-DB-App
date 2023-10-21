const express = require('express');
const { verifyToken, checkUser, checkRole } = require('../helpers/auth');

const router = express.Router();

// controllers
const { create, form } = require('../controllers/location');

router.post('/new', verifyToken, checkUser, checkRole('admin'), create);
router.get('/', verifyToken, checkUser, checkRole('admin'), form);

module.exports = router;
