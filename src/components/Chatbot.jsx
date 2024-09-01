import React, { useState } from "react";
import axios from "axios";
import "./css/Chatbot.css";
import { PiChatDuotone } from "react-icons/pi";
import { PiChatSlashDuotone } from "react-icons/pi";
import { HiPaperAirplane } from "react-icons/hi2";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;
    const userMessage = { name: "User", message: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/predict", {
        message: input,
      });
      const botMessage = {
        name: "Play2Earn.ai Bot",
        message: response.data.answer,
      };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbox">
      <div className={`chatbox__support ${isOpen ? "chatbox--active" : ""}`}>
        <div className="chatbox__header">
          <div className="chatbox__image--header">
            <img
              src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png"
              alt="Chat Header"
            />
          </div>
          <div className="chatbox__content--header">
            <h4 className="chatbox__heading--header">Chat Support</h4>
            <p className="chatbox__description--header">
              Hi. I am Play2Earn.ai Bot. How can I help you?
            </p>
          </div>
        </div>
        <div className="chatbox__messages">
          <div>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`messages__item ${
                  msg.name === "User"
                    ? "messages__item--operator"
                    : "messages__item--visitor"
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>
        </div>
        <div className="chatbox__footer">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <button
            className="chatbox__send--footer send__button"
            onClick={sendMessage}
          >
            Send <HiPaperAirplane />{" "}
          </button>
        </div>
      </div>
      <div className="chatbox__button">
        <button onClick={toggleChatbox}>
          {isOpen ? <PiChatSlashDuotone /> : <PiChatDuotone />}
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
