const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const passport = require('passport');

router.get('/', homeController.student);
router.get('/home', homeController.studentHome);

module.exports = router;