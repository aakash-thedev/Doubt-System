const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.home);
router.get('/dashboard', homeController.dashBoard);

router.use('/user', require('./user'));
router.use('/doubt', require('./doubt'));
router.use('/ta', require('./ta'));
router.use('/student', require('./student'));

module.exports = router;