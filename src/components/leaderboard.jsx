import React, { useState, useEffect } from "react";
import "./css/Leaderboard.css";
// changes made into the path for integration
import leadlead_bod_image1 from "/assets/lead_bod_image1.png";
import leadlead_bod_image2 from "/assets/lead_bod_image2.png";
import profile_for_leaderboard from "/assets/profile_for_leaderboard.png";
const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUsersData] = useState([]);
  const usersPerPage = 15;

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5001/api/leaderboard")
        .then((response) => response.json())
        .then((data) => setUsersData(data))
        .catch((error) => console.error("Error fetching data:", error));
    };

    // Fetch data initially
    fetchData();

    // Set interval to fetch data periodically
    const intervalId = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(usersData.length / usersPerPage);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersData.slice(indexOfFirstUser, indexOfLastUser);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/*
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-image" />
                    <span>Play2Earn</span>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                </div>
                <nav className="nav-links">
                    <a href="#link1">Home</a>
                    <a href="#link2">Leaderboard</a>
                    <a href="#link3">Dashboard</a>
                    <a href="#link4">Login</a>
                </nav>
            </header>
            */}

      <div className="title">
        <h1>Leaderboard</h1>
      </div>
      <div className="main-flex-container">
        <div className="flex-container">
          <div className="image-container">
            <img
              src={leadlead_bod_image1}
              alt="image 1"
              className="header-image"
            />
          </div>
          <div className="title2">
            <h2>
              Earn more points to reach the top 50 on the leaderboard.<br></br>A
              $100 prize pool will also be shared among the top 10
            </h2>
            <div className="you-earned">
              <img
                src={profile_for_leaderboard}
                alt="profile"
                className="profile-image"
              />
              <h2 className="earned"> You Earned: </h2>
              <h2 className="points"> 30000 </h2>
            </div>
          </div>
          <div className="image-container">
            <img
              src={leadlead_bod_image2}
              alt="image 2"
              className="header-image"
            />
          </div>
        </div>
        <div className="flex-container">
          <div className="leaderboard">
            <table>
              <thead>
                <tr>
                  <th className="th1">Rank</th>
                  <th className="th2">Username</th>
                  <th className="th2">Points Earned</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index}>
                    <td className="td1">{user.rank}</td>
                    <td className="td2">{user.username}</td>
                    <td className="td3">{user.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
