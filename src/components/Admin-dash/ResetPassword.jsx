import React, { useState } from "react";

function ResetPassword({ handleResetPassword, setIsResettingPassword }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      handleResetPassword(password);
    } else {
      alert("Passwords don't match!");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Reset Password</h2>
        <form onSubmit={onSubmit} className="form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
          />
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsResettingPassword(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
