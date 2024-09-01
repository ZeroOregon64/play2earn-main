const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, reward } = req.body;

    try {
        const task = new Task({title, description, reward});
        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Get a task
exports.getTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, reward } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            id,
            { title, description, reward },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Bulk delete tasks
exports.bulkDeleteTasks = async (req, res) => {
    const { taskIds } = req.body;

    try {
        const deletedTasks = await Task.deleteMany({ _id: { $in: taskIds } });

        if (!deletedTasks) {
            return res.status(404).json({ error: 'No tasks found to delete' });
        }

        res.json({ message: 'Tasks deleted successfully', deletedTasks });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
