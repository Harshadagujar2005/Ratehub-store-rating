const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.get('/stats', adminController.getDashboardStats);

router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('address').isLength({ max: 400 }).withMessage('Address exceeds 400 characters'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .matches(/[A-Z]/)
    .matches(/[!@#$%^&*(),.?":{}|<>]/),
  body('role').optional().isIn(['admin', 'user', 'store_owner']),
], adminController.createUser);

router.get('/stores', adminController.getStores);
router.post('/stores', [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('address').isLength({ max: 400 }).withMessage('Address exceeds 400 characters'),
], adminController.createStore);

module.exports = router;
