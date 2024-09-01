import React from "react";

const Sidebar = React.forwardRef(
  ({ setCurrentPage, isOpen, toggleSidebar, currentPage }, ref) => {
    return (
      <nav className={`sidebar ${isOpen ? "open" : ""}`} ref={ref}>
        <div className="sidebar-header">
          <h1>Play2Earn.ai</h1>
          <button className="close-sidebar" onClick={toggleSidebar}></button>
        </div>
        <ul className="sidebar-menu">
          <li className={currentPage === "analytics" ? "active" : ""}>
            <button
              onClick={() => {
                setCurrentPage("analytics");
                toggleSidebar();
              }}
            >
              Analytics
            </button>
          </li>
          <li className={currentPage === "task-management" ? "active" : ""}>
            <button
              onClick={() => {
                setCurrentPage("task-management");
                toggleSidebar();
              }}
            >
              Task Management
            </button>
          </li>
          <li className={currentPage === "user-management" ? "active" : ""}>
            <button
              onClick={() => {
                setCurrentPage("user-management");
                toggleSidebar();
              }}
            >
              User Management
            </button>
          </li>
          <li className={currentPage === "task-transactions" ? "active" : ""}>
            <button
              onClick={() => {
                setCurrentPage("task-transactions");
                toggleSidebar();
              }}
            >
              Task Transactions
            </button>
          </li>
        </ul>
      </nav>
    );
  }
);

export default Sidebar;
