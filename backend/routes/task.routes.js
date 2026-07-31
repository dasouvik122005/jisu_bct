const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, reorderTasks } = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/reorder').put(protect, reorderTasks);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
