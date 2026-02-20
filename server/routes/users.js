const express = require('express');
const router = express.Router();
const { getUsers, addUser, getUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('System Administrator'));

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:id', getUser);

module.exports = router;
