import React from "react";
import axios from "axios";
import { FaTwitter, FaWhatsapp, FaTelegram } from "react-icons/fa";

const ShareAchievement = ({ platform, userId, onShare }) => {
  const handleShareAchievement = async (socialPlatform) => {
    const shareText = encodeURIComponent(
      `I just completed the ${platform} follow task on Play2Earn website and earned 10 points! Join now: [Website URL]`
    );
    let shareUrl;

    switch (socialPlatform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${shareText}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=[Website URL]&text=${shareText}`;
        break;
      default:
        shareUrl = null;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }

    try {
      const API_BASE_URL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3001"
          : "https://4rzf4x59sk.execute-api.eu-north-1.amazonaws.com/dev";

      const apiUrl = `${API_BASE_URL}/share-achievement`;

      const response = await axios.post(apiUrl, {
        userId,
        platform,
      });

      if (response.data.success) {
        if (onShare) {
          onShare(
            platform,
            socialPlatform,
            response.data.sharePoints,
            response.data.totalPoints
          );
        }
      }
    } catch (error) {
      console.error("Error sharing achievement:", error);
    }
  };

  return (
    <div className="share-options">
      <h4>Share your achievement:</h4>
      <div className="share-buttons">
        <button onClick={() => handleShareAchievement("twitter")}>
          <FaTwitter /> Twitter
        </button>
        <button onClick={() => handleShareAchievement("whatsapp")}>
          <FaWhatsapp /> WhatsApp
        </button>
        <button onClick={() => handleShareAchievement("telegram")}>
          <FaTelegram /> Telegram
        </button>
      </div>
    </div>
  );
};

export default ShareAchievement;
