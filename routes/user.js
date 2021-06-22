const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register/:userType', userController.register);
router.get('/login/:userType', passport.authenticate('local', {failureRedirect: '/'}), userController.login);
router.get('/destroySession', userController.destroySession);

module.exports = router;