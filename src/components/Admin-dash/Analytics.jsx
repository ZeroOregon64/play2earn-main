import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./CSS/Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Analytics() {
  const [timeRange, setTimeRange] = useState("week");
  const [taskChartType, setTaskChartType] = useState("completed");

  // Sample data (same as before)
  const taskCompletionData = {
    week: [100, 150, 120, 180, 200, 160, 190],
    month: [500, 600, 550, 700, 650, 800, 750, 900],
    year: [
      5000, 5500, 6000, 5800, 6200, 6500, 7000, 6800, 7200, 7500, 7800, 8000,
    ],
  };

  const newUserData = {
    week: [10, 15, 12, 18, 20, 16, 19],
    month: [50, 60, 55, 70, 65, 80, 75, 90],
    year: [500, 550, 600, 580, 620, 650, 700, 680, 720, 750, 780, 800],
  };

  const topTasks = [
    { name: "Task 1", completed: 500, reward: 50 },
    { name: "Task 2", completed: 450, reward: 30 },
    { name: "Task 3", completed: 400, reward: 40 },
    { name: "Task 4", completed: 350, reward: 60 },
    { name: "Task 5", completed: 300, reward: 20 },
  ];

  // Chart data and options (same as before)
  const getLabels = (range) => {
    switch (range) {
      case "week":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      case "month":
        return [
          "Week 1",
          "Week 2",
          "Week 3",
          "Week 4",
          "Week 5",
          "Week 6",
          "Week 7",
          "Week 8",
        ];
      case "year":
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      default:
        return [];
    }
  };

  const taskCompletionChartData = {
    labels: getLabels(timeRange),
    datasets: [
      {
        label: "Tasks Completed",
        data: taskCompletionData[timeRange],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const newUserChartData = {
    labels: getLabels(timeRange),
    datasets: [
      {
        label: "New Users",
        data: newUserData[timeRange],
        fill: false,
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  const topTasksChartData = {
    labels: topTasks.map((task) => task.name),
    datasets: [
      {
        label:
          taskChartType === "completed" ? "Tasks Completed" : "Task Reward",
        data: topTasks.map((task) =>
          taskChartType === "completed" ? task.completed : task.reward
        ),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="analytics">
      <h2 className="mb-4">Analytics Dashboard</h2>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Tasks</h3>
          <p>1000</p>
        </div>
        <div className="summary-card">
          <h3>Total Users</h3>
          <p>500</p>
        </div>
        <div className="summary-card">
          <h3>Total Rewards</h3>
          <p>25000</p>
        </div>
        <div className="summary-card">
          <h3>Task Types</h3>
          <p>15</p>
        </div>
      </div>

      <div className="mb-4">
        <select
          className="form-control"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="row charts">
        <div className="col-lg-6 mb-4">
          <h3>Tasks Completed Over Time</h3>
          <Line data={taskCompletionChartData} />
        </div>
        <div className="col-lg-6 mb-4">
          <h3>New User Registrations</h3>
          <Line data={newUserChartData} />
        </div>
        <div className="col-lg-6 mb-4">
          <h3>Top 5 Tasks</h3>
          <select
            className="form-control mb-2"
            value={taskChartType}
            onChange={(e) => setTaskChartType(e.target.value)}
          >
            <option value="completed">Most Completed</option>
            <option value="reward">Highest Reward</option>
          </select>
          <Bar data={topTasksChartData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
