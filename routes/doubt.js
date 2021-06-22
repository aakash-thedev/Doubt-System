const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');

router.post('/createDoubt', doubtController.createDoubt);
router.post('/createComment', doubtController.createComment);

router.post('/resolveDoubt/', doubtController.resolveDoubt);
router.get('/escalateDoubt', doubtController.escalateDoubt);

module.exports = router;