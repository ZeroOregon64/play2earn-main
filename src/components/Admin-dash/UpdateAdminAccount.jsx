import React, { useState, useRef } from "react";

function UpdateAdminAccount({
  adminAccount,
  handleUpdateAdminAccount,
  setIsEditingAdminAccount,
}) {
  const [previewImage, setPreviewImage] = useState(adminAccount.profilePic);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const updatedAccount = {
      username: e.target.username.value,
      email: e.target.email.value,
      profilePic: previewImage,
    };
    handleUpdateAdminAccount(updatedAccount);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Admin Account</h2>
        <form onSubmit={onSubmit} className="form">
          <div className="profile-pic-container">
            <img
              src={previewImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-pic"
              onClick={() => fileInputRef.current.click()}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <input
            type="text"
            name="username"
            defaultValue={adminAccount.username}
            required
          />
          <input
            type="email"
            name="email"
            defaultValue={adminAccount.email}
            required
          />
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Update Account
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditingAdminAccount(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateAdminAccount;
