import React from "react";
import "./css/Referrals.css";

function generateRandomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let result = "";
  for (let i = 0; i < 15; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
}

const ReferralsPage = () => {
  const referralCode = generateRandomCode();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralCode)
      .then(() => {
        alert("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="referrals-page">
      <div className="main-content">
        <div className="left-content">
          <div className="button-container">
            <a href="#" className="referrals-button">
              Referrals
            </a>
          </div>

          <div className="title">
            <h1>Earn a 10% Lifetime Bonus by referring your friends!</h1>
          </div>

          <div className="instructions">
            <h2>Instructions:</h2>
            <ol>
              <li>Share your Referral Code with Friends</li>
              <li>
                Invite Friends to Sign Up: They Receive a 10% Bonus on their
                First Completed Task
              </li>
              <li>
                You will Earn a 10% Bonus for Every Task your Friends Complete
              </li>
            </ol>
          </div>

          <div className="referral-code">
            <h2>Your Referral Code</h2>
            <div className="code">
              <h4>{referralCode}</h4>
            </div>
            <button onClick={handleCopy} className="copy-button">
              Copy
            </button>
          </div>

          <div className="bonus-code">
            <h3>Have a Bonus Code from your Friend?</h3>
          </div>

          <div className="summary">
            <h6>Your Summary</h6>
            <div className="summary-details">
              <div className="referred-friends">
                <h5>Referred Friends</h5>
                <div className="detail">
                  <img src="/assets/people.png" alt="people" className="icon" />
                  <span>- 2</span>
                </div>
              </div>
              <div className="bonus-earned">
                <h5>Bonus Earned</h5>
                <div className="detail">
                  <img
                    src="/assets/bitcoin.png"
                    alt="bitcoin"
                    className="icon"
                  />
                  <span>- 0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-content">
          <img
            src="/assets/handshake.png"
            alt="handshake"
            className="large-image"
          />
          <div className="image-group">
            <img src="/assets/money.png" alt="money" className="medium-image" />
            <img
              src="/assets/notebook.png"
              alt="notebook"
              className="medium-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
