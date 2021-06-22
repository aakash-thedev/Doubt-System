const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.ta);
router.get('/home', homeController.taHome);
router.get('/doubt/', homeController.dedicated_doubt_page);

module.exports = router;