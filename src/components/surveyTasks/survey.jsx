import "../css/survey.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FormfacadeEmbed from "@formfacade/embed-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faPlayCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShareAchievement from "./ShareAchievement";

function Survey() {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);
  const [showForm, setShowForm] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const API_BASE_URL =
          process.env.NODE_ENV === "development"
            ? "http://localhost:5002"
            : "https://4rzf4x59sk.execute-api.eu-north-1.amazonaws.com/dev";

        const apiUrl = `${API_BASE_URL}/api/tasks`;

        const response = await axios.get(apiUrl);

        const surveyTasks = response.data.filter((task) =>
          task.title.includes("Survey")
        );

        setTasks(surveyTasks);
        setShowForm(new Array(surveyTasks.length).fill(false));
        setFormSubmitted(new Array(surveyTasks.length).fill(false));
        setTaskStatus(new Array(surveyTasks.length).fill("Incomplete"));
        setShowShareOptions(new Array(surveyTasks.length).fill(false));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  const completeSurvey = (surveyNumber) => {
    setTimeout(() => {
      const surveyNames = tasks.map((task) => task.title);
      toast.success(
        `Congratulations on completing ${surveyNames[surveyNumber]}!`
      );
      setPoints(points + 10);
      const newFormSubmitted = [...formSubmitted];
      newFormSubmitted[surveyNumber] = true;
      setFormSubmitted(newFormSubmitted);
      const newShowForm = [...showForm];
      newShowForm[surveyNumber] = false;
      setShowForm(newShowForm);
      const newTaskStatus = [...taskStatus];
      newTaskStatus[surveyNumber] = "Completed";
      setTaskStatus(newTaskStatus);
      const newShowShareOptions = [...showShareOptions];
      newShowShareOptions[surveyNumber] = true;
      setShowShareOptions(newShowShareOptions);
    }, 1000);
  };

  const handleButtonClick = (surveyNumber) => {
    const canOpen = surveyNumber === 0 || formSubmitted[surveyNumber - 1];
    if (canOpen) {
      const newShowForm = new Array(tasks.length).fill(false);
      newShowForm[surveyNumber] = true;
      setShowForm(newShowForm);
      const newTaskStatus = [...taskStatus];
      newTaskStatus[surveyNumber] = "In Progress";
      setTaskStatus(newTaskStatus);
    } else {
      toast.error("Please complete the previous task before opening this one.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Incomplete":
        return (
          <FontAwesomeIcon icon={faTimesCircle} style={{ color: "red" }} />
        );
      case "In Progress":
        return (
          <FontAwesomeIcon icon={faPlayCircle} style={{ color: "orange" }} />
        );
      case "Completed":
        return (
          <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green" }} />
        );
      default:
        return null;
    }
  };

  const handleShare = (platform, socialPlatform) => {
    toast.success(`Shared achievement on ${socialPlatform}!`);
  };

  return (
    <div className="survey">
      <ToastContainer />
      <header className="survey-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Survey Forms Task</h1>
            <p>Complete the given survey forms to receive your points!</p>
          </div>
          <div className="header-right">
            <h2>Your Points: {points}</h2>
          </div>
        </div>
        <div className="tasks-container">
          {tasks.map((task, index) => (
            <div
              key={task._id}
              className={`task-card ${taskStatus[index]
                ?.toLowerCase()
                .replace(" ", "-")}`}
            >
              <div className="task-content">
                <div className="task-details">
                  <h3>{task.title}</h3>
                </div>
                <div className="task-actions">
                  {!formSubmitted[index] && (
                    <button onClick={() => handleButtonClick(index)}>
                      Open
                    </button>
                  )}
                  {formSubmitted[index] && <button disabled>Submitted</button>}
                </div>
              </div>
              {showForm[index] && (
                <div className="form-container">
                  <FormfacadeEmbed
                    formFacadeURL={task.formURL}
                    onSubmitForm={() => completeSurvey(index)}
                  />
                </div>
              )}
              <div className="task-status">
                {getStatusIcon(taskStatus[index])} {taskStatus[index]}
              </div>
              {showShareOptions[index] && (
                <ShareAchievement
                  platform={task.title}
                  userId="user123" // Replace
                  onShare={handleShare}
                />
              )}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default Survey;
