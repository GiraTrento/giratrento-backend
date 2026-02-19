const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin, isMerchant } = require('../middleware/roleMiddleware');

const authController = require('../controllers/authController');
const activityController = require('../controllers/activityController');
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');

// AUTH
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// ACTIVITIES (NO LOGIN)
router.get('/activities', activityController.getActivities); // Vede solo le approvate

// ACTIVITIES (LOGIN)
router.post('/activities', authMiddleware, activityController.suggestActivity);
router.post('/activities/:id/reviews', authMiddleware, activityController.addReview);

// PRODUCTS
router.post('/activities/:id/products', authMiddleware, activityController.addProduct);
router.put('/activities/:id/products/:productId', authMiddleware, activityController.updateProduct);
router.delete('/activities/:id/products/:productId', authMiddleware, activityController.deleteProduct);

// ADMIN PANEL
router.get('/admin/pending', authMiddleware, isAdmin, adminController.getPendingActivities);
router.put('/admin/approve/:id', authMiddleware, isAdmin, adminController.approveActivity);
router.get('/admin/users', authMiddleware, isAdmin, adminController.getAllUsers);
router.put('/admin/users/:id/role', authMiddleware, isAdmin, adminController.updateUserRole);
router.delete('/admin/activity/:id', authMiddleware, isAdmin, adminController.deleteActivity);
router.put('/admin/activity/:id', authMiddleware, isAdmin, adminController.updateActivity);

// ORDERS
router.post('/orders', authMiddleware, orderController.createOrder);
router.get('/orders', authMiddleware, orderController.getMyOrders);

module.exports = router;
