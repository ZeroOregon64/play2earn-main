const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/create', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/bulk-delete', taskController.bulkDeleteTasks);

module.exports = router;
