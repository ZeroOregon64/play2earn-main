import React, { useState, useEffect } from "react";
import "./CSS/UserManagement.css";

function EditUserModal({ user, onUpdate, onClose }) {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedUser);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            value={editedUser.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            name="email"
            value={editedUser.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            name="country"
            value={editedUser.country}
            onChange={handleChange}
            placeholder="Country"
          />
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    // Simulated API call to fetch users
    const fetchUsers = () => {
      const sampleUsers = [
        {
          id: 1,
          username: "michaelwilliams",
          email: "erick@example.net",
          country: "Saint Barthelemy",
          totalRewards: 130,
          status: "active",
        },
        {
          id: 2,
          username: "sean78",
          email: "ksaunders@example.net",
          country: "Faroe Islands",
          totalRewards: 2300,
          status: "active",
        },
        {
          id: 3,
          username: "chaveztraoey",
          email: "fisher@example.com",
          country: "Costa Rica",
          totalRewards: 75,
          status: "inactive",
        },
        {
          id: 4,
          username: "ganthony",
          email: "walkermichael@example.com",
          country: "Costa Rica",
          totalRewards: 0,
          status: "banned",
        },
        {
          id: 5,
          username: "charlottewilliams",
          email: "hhughes@example.net",
          country: "Germany",
          totalRewards: 600,
          status: "inactive",
        },
        {
          id: 6,
          username: "tina13",
          email: "kelly@example.org",
          country: "Austria",
          totalRewards: 10000,
          status: "active",
        },
      ];
      setUsers(sampleUsers);
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditingUser(null);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleBanUnban = (userId) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            status: user.status === "banned" ? "active" : "banned",
          };
        }
        return user;
      })
    );
  };

  const handleDeleteConfirmation = (userId) => {
    setConfirmationAction(() => () => handleDelete(userId));
    setConfirmationMessage("Are you sure you want to delete this user?");
    setShowConfirmation(true);
  };

  const handleBanConfirmation = (userId) => {
    setConfirmationAction(() => () => handleBanUnban(userId));
    setConfirmationMessage("Are you sure you want to ban/unban this user?");
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    confirmationAction();
    setShowConfirmation(false);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedUsers.length > 0) {
      setConfirmationAction(() => () => {
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
      });
      setConfirmationMessage(
        `Are you sure you want to delete ${selectedUsers.length} selected user(s)?`
      );
      setShowConfirmation(true);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-management">
      <h2>Users</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <button
        className="btn btn-danger"
        onClick={handleDeleteSelected}
        disabled={selectedUsers.length === 0}
      >
        Delete Selected ({selectedUsers.length})
      </button>
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(currentUsers.map((user) => user.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                  checked={
                    selectedUsers.length === currentUsers.length &&
                    currentUsers.length > 0
                  }
                />
              </th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Country</th>
              <th>Total Rewards</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.country}</td>
                <td>{user.totalRewards}</td>
                <td>
                  <span className={`status ${user.status}`}>{user.status}</span>
                </td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDeleteConfirmation(user.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={`btn ${
                      user.status === "banned" ? "btn-unban" : "btn-ban"
                    }`}
                    onClick={() => handleBanConfirmation(user.id)}
                  >
                    {user.status === "banned" ? "Unban" : "Ban"}
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
        {getPageNumbers().map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Next
        </button>
      </div>
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onUpdate={handleUpdateUser}
          onClose={() => setEditingUser(null)}
        />
      )}
      {showConfirmation && (
        <ConfirmationModal
          message={confirmationMessage}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}

export default UserManagement;
