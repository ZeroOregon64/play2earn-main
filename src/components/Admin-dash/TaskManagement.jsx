import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/TaskManagement.css";

function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "", // Added title here
    description: "",
    category: "",
    reward: "",
    difficulty: "",
  });
  const [filterFilledTasks, setFilterFilledTasks] = useState(false);

  // Determine the API base URL based on the environment
  const API_BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5002"
      : "https://4rzf4x59sk.execute-api.eu-north-1.amazonaws.com/dev";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [API_BASE_URL]);

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const isMainTask = (task) => {
    return (
      task.title && // Check for title
      task.description &&
      task.category &&
      task.reward !== undefined &&
      task.difficulty !== undefined
    );
  };

  const handleAddNewTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/tasks/create`, // Fixed URL construction
        newTask,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const addedTask = response.data;
      console.log("New Task Added:", addedTask); // Logging the added task

      // Add the new task to the list and check if it qualifies as a main task
      setTasks((prevTasks) => [...prevTasks, addedTask]);

      // Clear the form after adding the task
      setNewTask({
        title: "", // Clear title field
        description: "",
        category: "",
        reward: "",
        difficulty: "",
      });
    } catch (error) {
      console.error(
        "Error adding task:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleEditTask = (task) => {
    setEditingTask({ ...task });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/tasks/${editingTask._id}`,
        editingTask
      );
      setTasks(
        tasks.map((task) =>
          task._id === editingTask._id ? response.data : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error(
        "Error updating task:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteTask = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskToDelete}`);
      setTasks(tasks.filter((task) => task._id !== taskToDelete));
      setShowDeleteConfirmation(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDeleteSelectedTasks = async () => {
    const selectedTasks = tasks
      .filter((task) => task.selected)
      .map((task) => task._id);
    if (selectedTasks.length > 0) {
      setTaskToDelete("selected");
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeleteSelectedTasks = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/tasks/bulk-delete`, {
        taskIds: tasks.filter((task) => task.selected).map((task) => task._id),
      });
      setTasks(tasks.filter((task) => !task.selected));
      setShowDeleteConfirmation(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting selected tasks:", error);
    }
  };

  const handleSelectTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task._id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (!filterFilledTasks || isMainTask(task)) &&
      (task.description || "")
        .toLowerCase()
        .includes(taskSearchTerm.toLowerCase())
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="task-management">
      <h2>Task Management</h2>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={taskSearchTerm}
          onChange={(e) => setTaskSearchTerm(e.target.value)}
        />
      </div>

      <button
        onClick={() => setFilterFilledTasks(!filterFilledTasks)}
        className="btn-main"
        aria-label={
          filterFilledTasks ? "Show all tasks" : "Show main tasks container"
        }
      >
        {filterFilledTasks ? "Show All Tasks" : "Show main tasks container"}
      </button>

      <button onClick={handleDeleteSelectedTasks} className="btn btn-danger">
        Delete Selected
      </button>

      <div className="table-responsive">
        <table className="task-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setTasks(
                      tasks.map((task) => ({
                        ...task,
                        selected: e.target.checked,
                      }))
                    )
                  }
                />
              </th>
              <th>Task No</th>
              <th>Title</th> {/* Added Title column */}
              <th>Description</th>
              <th>Category</th>
              <th>Reward</th>
              {filterFilledTasks && <th>Difficulty</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={task.selected || false}
                    onChange={() => handleSelectTask(task._id)}
                  />
                </td>
                <td>{task._id}</td>
                <td>{task.title}</td> {/* Display title */}
                <td>{task.description}</td>
                <td>{task.category}</td>
                <td>{task.reward}</td>
                {filterFilledTasks && <td>{task.difficulty} Minutes</td>}
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(Math.ceil(filteredTasks.length / tasksPerPage)).keys()].map(
          (number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={currentPage === number + 1 ? "active" : ""}
            >
              {number + 1}
            </button>
          )
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastTask >= filteredTasks.length}
        >
          Next
        </button>
      </div>

      <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>
      <form
        onSubmit={editingTask ? handleUpdateTask : handleAddNewTask}
        className="add-task-form"
      >
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Task Title" // Added Title input field
            value={editingTask ? editingTask.title : newTask.title}
            onChange={
              editingTask
                ? (e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                : handleNewTaskChange
            }
            required
          />
        </div>
        <div className="form-group full-width">
          <textarea
            name="description"
            placeholder="Task Description"
            value={editingTask ? editingTask.description : newTask.description}
            onChange={
              editingTask
                ? (e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                : handleNewTaskChange
            }
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="category"
            placeholder="Task Category"
            value={editingTask ? editingTask.category : newTask.category}
            onChange={
              editingTask
                ? (e) =>
                    setEditingTask({ ...editingTask, category: e.target.value })
                : handleNewTaskChange
            }
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="reward"
            placeholder="Task Reward"
            value={editingTask ? editingTask.reward : newTask.reward}
            onChange={
              editingTask
                ? (e) =>
                    setEditingTask({ ...editingTask, reward: e.target.value })
                : handleNewTaskChange
            }
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="difficulty"
            placeholder="Task Difficulty (Minutes)"
            value={editingTask ? editingTask.difficulty : newTask.difficulty}
            onChange={
              editingTask
                ? (e) =>
                    setEditingTask({
                      ...editingTask,
                      difficulty: e.target.value,
                    })
                : handleNewTaskChange
            }
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>

      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <p>
            Are you sure you want to delete{" "}
            {taskToDelete === "selected" ? "selected tasks" : "this task"}?
          </p>
          <div className="button-group">
            <button
              className="btn btn-danger"
              onClick={
                taskToDelete === "selected"
                  ? confirmDeleteSelectedTasks
                  : confirmDeleteTask
              }
            >
              Yes
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskManagement;
