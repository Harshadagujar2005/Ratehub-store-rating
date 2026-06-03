const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const passwordRules = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

router.post('/register', [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('address').isLength({ max: 400 }).withMessage('Address must not exceed 400 characters'),
  passwordRules,
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
], authController.login);

router.patch('/update-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/)
    .withMessage('Must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Must contain at least one special character'),
], authController.updatePassword);

router.get('/me', authenticate, authController.getMe);

module.exports = router;
