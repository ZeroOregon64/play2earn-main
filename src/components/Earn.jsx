import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Earn.css";

// TaskCard Component
const TaskCard = ({ task, onSelect }) => (
  <div className="task-card" onClick={() => onSelect(task)}>
    <div className="task-card-content">
      <img
        src={task.logo}
        alt={`${task.category} logo`}
        className="task-logo"
      />
      <h3>{task.category}</h3>
      <p>{task.description}</p>
      <div className="task-card-footer">
        <span className="task-difficulty">{task.difficulty}</span>
        <span className="task-reward">{task.reward} pts</span>
      </div>
    </div>
  </div>
);

// TaskModal Component
const TaskModal = ({ task, onClose, onAccept }) => {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    setAgreed(localStorage.getItem("agreed") === "true");
  }, []);

  const handleCheckboxChange = () => {
    const newAgreed = !agreed;
    setAgreed(newAgreed);
    localStorage.setItem("agreed", newAgreed);
  };

  if (!task) return null;

  const instructionsArray = Array.isArray(task.instructions)
    ? task.instructions
    : task.instructions.split("\n");

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">
          &times;
        </button>
        <div className="modal-header">
          <img
            src={task.logo}
            alt={`${task.category} logo`}
            className="modal-logo"
          />
          <h2>{task.category}</h2>
        </div>
        <div className="modal-body">
          <h3>{task.description}</h3>
          <div className="task-details">
            <span className="task-difficulty">{task.difficulty}</span>
            <span className="task-reward">{task.reward} pts</span>
          </div>
          <div className="instructions">
            <h4>Instructions:</h4>
            <ol>
              {instructionsArray.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          <div className="terms">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="terms-link"
              >
                terms and services
              </a>
            </label>
          </div>
          <button
            onClick={() => onAccept(task)}
            className="accept-button"
            disabled={!agreed}
          >
            Accept Task
          </button>
        </div>
      </div>
    </div>
  );
};

// Earn Component
const Earn = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const API_BASE_URL =
          process.env.NODE_ENV === "development"
            ? "http://localhost:5002"
            : "https://4rzf4x59sk.execute-api.eu-north-1.amazonaws.com/dev";

        const apiUrl = `${API_BASE_URL}/api/tasks`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const data = await response.json();
        setTasks(
          data.map((task) => ({
            ...task,
            id: task._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(
      (task) =>
        task.category &&
        (selectedCategory === "All" || task.category === selectedCategory) &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [tasks, selectedCategory, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleTaskAccept = (task) => {
    if (task.category === "Survey") {
      navigate("/survey");
    }
    if (task.category === "Wordify") {
      navigate("/Wordify");
    }
    if (task.category === "Text tagging") {
      navigate("/TextTaggingGame");
    }
    
    setSelectedTask(null);
  };

  const categories = [
    "All",
    "Survey",
    "CAPTCHA",
    "Feedback",
    "Audio Transcription",
    "Follow task",
    "Text Tagging ",
    "Image captcha task",
    "Translation challenge",
    "Wordify",
  ];

  return (
    <div className="earn-container">
      <h1>Task Marketplace</h1>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
          ))}
        </div>
      )}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onAccept={handleTaskAccept}
        />
      )}
    </div>
  );
};

export default Earn;
