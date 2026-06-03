const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');

// Normal users browse stores and rate them
router.get('/', authenticate, authorize('user', 'admin'), storeController.getAllStores);
router.post('/rate', authenticate, authorize('user'), storeController.submitRating);

// Store owner dashboard
router.get('/my-store', authenticate, authorize('store_owner'), storeController.getMyStoreRatings);

module.exports = router;
