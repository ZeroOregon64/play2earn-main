import React, { useState, useEffect, useRef } from "react";
import "../css/Wordify.css";
import jsonData from "./Wordify_words.json"; // Adjust the path as necessary
import {
  FaLock,
  FaUnlock,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaTrophy,
} from "react-icons/fa";
import Confetti from "react-confetti";

function Wordify() {
  const [currentLevel, setCurrentLevel] = useState(() => {
    return parseInt(localStorage.getItem("currentLevel")) || 1;
  });
  const [timeRemaining, setTimeRemaining] = useState(60);

  const setInitialTimeRemaining = () => {
    let timeLimit;
    if (currentLevel >= 1 && currentLevel <= 3) {
      timeLimit = 60; // 60 seconds for levels 1 to 3
    } else if (currentLevel >= 4 && currentLevel <= 7) {
      timeLimit = 45; // 45 seconds for levels 4 to 7
    } else if (currentLevel >= 8 && currentLevel <= 10) {
      timeLimit = 30; // 30 seconds for levels 8 to 10
    }
    setTimeRemaining(timeLimit);
  };

  const [userWords, setUserWords] = useState([]);
  const [aiWords, setAiWords] = useState([]);
  const [inputWord, setInputWord] = useState("");
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(() => {
    return parseInt(localStorage.getItem("totalPoints")) || 0;
  });
  const [randomLetters, setRandomLetters] = useState([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(-1);
  const [timerExpired, setTimerExpired] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [onLevelsPage, setOnLevelsPage] = useState(false);
  const [onEndPage, setOnEndPage] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showSaveExitPopup, setShowSaveExitPopup] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (hasStarted) {
      const fetchLettersAndAiWords = () => {
        const levelData = getRandomLevelData(currentLevel);
        if (levelData) {
          setRandomLetters(levelData.letters || []);
          setAiWords(levelData.words || []);
          let index = 0;
          const letterInterval = setInterval(() => {
            setCurrentLetterIndex(index);
            index += 1;
            if (index === (levelData.letters || []).length) {
              clearInterval(letterInterval);
            }
          }, 500);
        } else {
          console.error("No level data found for difficulty:", currentLevel);
        }
      };

      setInitialTimeRemaining();
      fetchLettersAndAiWords();
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [hasStarted, currentLevel]);

  const getRandomLevelData = (level) => {
    const levelData = jsonData.filter((item) => item.difficulty === level);
    if (levelData.length > 0) {
      return levelData[Math.floor(Math.random() * levelData.length)];
    }
    return null;
  };

  const startGame = () => {
    setInitialTimeRemaining();
    setHasStarted(true);
    setOnLevelsPage(false);
  };

  const goToLevelsPage = () => {
    clearInterval(timerRef.current);
    setOnLevelsPage(true);
  };

  const selectLevel = (level) => {
    if (level === currentLevel) {
      setCurrentLevel(level);
      setHasStarted(true);
      setOnLevelsPage(false);
      startTimer();
    }
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          setTimerExpired(true);
          clearInterval(timerRef.current);
          return 0;
        }
      });
    }, 1000);
  };

  const handleInputChange = (e) => {
    setInputWord(e.target.value);
  };

  const normalizeText = (text) => {
    return text.toLowerCase();
  };

  const handleSubmit = () => {
    const normalizedInputWord = normalizeText(inputWord);
    if (normalizedInputWord && !userWords.includes(normalizedInputWord)) {
      setUserWords((prevWords) => {
        const newWords = [...prevWords, normalizedInputWord];
        calculatePoints(newWords);
        return newWords;
      });
      setInputWord("");
    }
  };

  const calculatePoints = (newWords) => {
    let newPoints = 0;
    const normalizedAiWords = aiWords.map((word) => normalizeText(word));
    const pointsPerWord = currentLevel <= 5 ? 5 : 10;
    newWords.forEach((word) => {
      const normalizedWord = normalizeText(word);
      if (normalizedAiWords.includes(normalizedWord)) {
        newPoints += pointsPerWord;
      }
    });
    setPoints(newPoints);
  };

  const handleNextLevel = () => {
    const updatedTotalPoints = totalPoints + points;
    setTotalPoints(updatedTotalPoints);
    localStorage.setItem("totalPoints", updatedTotalPoints);

    if (currentLevel < 10) {
      const completedLevels =
        JSON.parse(localStorage.getItem("completedLevels")) || [];
      if (!completedLevels.includes(currentLevel)) {
        completedLevels.push(currentLevel);
      }
      localStorage.setItem("completedLevels", JSON.stringify(completedLevels));

      setCurrentLevel(currentLevel + 1);
      setUserWords([]);
      setAiWords([]);
      setRandomLetters([]);
      setCurrentLetterIndex(-1);
      setTimerExpired(false);
      setPoints(0);
      setInitialTimeRemaining();
      localStorage.setItem("currentLevel", currentLevel + 1);
    } else {
      setHasStarted(false);
      setOnLevelsPage(false);
      setOnEndPage(true);
    }
  };

  const handleSaveAndExit = () => {
    clearInterval(timerRef.current);
    const updatedTotalPoints = totalPoints + points;
    localStorage.setItem("totalPoints", updatedTotalPoints);
    localStorage.setItem("currentLevel", currentLevel);
    setShowSaveExitPopup(true);
  };

  const handleExit = () => {
    const confirmed = window.confirm(
      "Are you sure? Exiting will reset your progress."
    );
    if (confirmed) {
      clearInterval(timerRef.current);
      localStorage.clear();
      setUserWords([]);
      setAiWords([]);
      setRandomLetters([]);
      setCurrentLetterIndex(0);
      setTimerExpired(false);
      setTimeRemaining(0);
      setPoints(0);
      setTotalPoints(0);
      setCurrentLevel(1);
      setHasStarted(false);
      setOnLevelsPage(false);
      alert("Game data reset. You have exited to the main menu.");
    }
  };

  const renderEndScreen = () => {
    return (
      <div className="wordify-end-screen">
        <h2 className="wordify-end-header">Game Over!</h2>
        <div className="wordify-winner">
          <FaTrophy /> {points} points
        </div>
        <p className="wordify-end-para">
          Congratulations! You've completed the game.
        </p>
        <p>Your final score: {totalPoints}</p>
        <div className="wordify-share-achievement">
          <p>Share your achievement:</p>
          <div className="wordify-share-buttons">
            <button className="wordify-share-button wordify-twitter">
              <FaTwitter /> Twitter
            </button>
            <button className="wordify-share-button wordify-whatsapp">
              <FaWhatsapp /> WhatsApp
            </button>
            <button className="wordify-share-button wordify-telegram">
              <FaTelegram /> Telegram
            </button>
          </div>
        </div>
        <button className="wordify-finish-button" onClick={resetGame}>
          Play Again
        </button>
      </div>
    );
  };

  const renderLevelsPage = () => {
    const levels = [];
    for (let i = 1; i <= 10; i++) {
      const isLocked = i > currentLevel;
      const isCompleted = i < currentLevel;
      levels.push(
        <button
          key={i}
          className={`wordify-level-button ${
            isCompleted ? "wordify-completed" : ""
          } ${isLocked ? "wordify-locked" : ""} ${
            !isLocked && !isCompleted ? "wordify-current" : ""
          }`}
          onClick={() => !isLocked && selectLevel(i)}
          disabled={isLocked || isCompleted}
        >
          {isLocked || isCompleted ? (
            <FaLock className="wordify-icon" style={{ marginRight: "1px" }} />
          ) : (
            <FaUnlock className="wordify-icon" style={{ marginRight: "1px" }} />
          )}
          {(isCompleted || !isLocked) && (
            <span className="wordify-level-number">{i}</span>
          )}
        </button>
      );
    }
    return (
      <div className="wordify-levels-page">
        <header className="wordify-app-header">
          <h1>Select a Level</h1>
        </header>
        <div className="wordify-levels-container">{levels}</div>
      </div>
    );
  };

  const getLevelText = () => {
    switch (currentLevel) {
      case 1:
        return "Let's get started with some simple 3 letter words.";
      case 2:
        return "Great job! Now let's continue making more 3 letter words.";
      case 3:
        return "You're doing well! This level will be the last level with just 3 letter words.";
      case 4:
        return "Well Done! Let's get started with some 4 letter words as well.";
      case 5:
        return "Nice work! Keep entering 3 and 4 letter words.";
      case 6:
        return "Great Job! This is the last level with 3 and 4 letter words.";
      case 7:
        return "Excellent! From now on there are no word size restrictions, make as many 3, 4 and 5 letter words!";
      default:
        return "Keep it up! You're getting closer to the end!";
    }
  };

  const ShareAchievement = ({ totalPoints, currentLevel }) => {
    const shareMessage = `I've reached level ${currentLevel} with ${totalPoints} points in Wordify! Can you beat my score? https://www.play2earn.ai`;

    const shareTwitter = () => {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareMessage
        )}`,
        "_blank"
      );
    };

    const shareWhatsApp = () => {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
        "_blank"
      );
    };

    const shareTelegram = () => {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(
          window.location.href
        )}&text=${encodeURIComponent(shareMessage)}`,
        "_blank"
      );
    };

    return (
      <div className="wordify-share-achievement">
        <h3>Share your achievement!</h3>
        <div className="wordify-share-buttons">
          <button
            onClick={shareTwitter}
            className="wordify-share-button wordify-twitter"
          >
            <FaTwitter /> Twitter
          </button>
          <button
            onClick={shareWhatsApp}
            className="wordify-share-button wordify-whatsapp"
          >
            <FaWhatsapp /> WhatsApp
          </button>
          <button
            onClick={shareTelegram}
            className="wordify-share-button wordify-telegram"
          >
            <FaTelegram /> Telegram
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="wordify-app">
      {!hasStarted && !onLevelsPage && !onEndPage && (
        <>
          <header className="wordify-app-header">
            <h1>Wordify - Word Creation Game</h1>
          </header>
          <div className="wordify-content"></div>
          <div className="ai-words-container">
            <h2>AI Generated Words:</h2>
            <ul>
              {aiWords.map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </div>
          <div className="wordify-info">
            <h2 className="wordify-title">
              AI-Powered Word Creation and Matching Game
            </h2>
            <p>
              Welcome to the AI-Powered Word Creation and Matching Game! In this
              game, you'll harness the power of artificial intelligence to
              create and match words. It's a fun and educational way to enhance
              your vocabulary and cognitive abilities.
            </p>
            <h3 className="wordify-obj">Objective: </h3>
            <p>
              The goal is to create as many words as possible using the given
              letters within a time limit. Match the words with the AI-generated
              words to earn points. Challenge yourself and see how many words
              you can create and match!
            </p>
          </div>
          <div className="wordify-start-container">
            <button className="wordify-start-button" onClick={goToLevelsPage}>
              START
            </button>
          </div>
        </>
      )}
      {onEndPage ? (
        <>
          <header className="wordify-app-header">
            <h1>Wordify - Word Creation Game</h1>
          </header>
          <div>
            <h2 className="wordify-end-header">Game Completed!</h2>
            <p className="wordify-end-para">You completed all the levels. </p>
            <div>
              <h2>Your total points: {totalPoints}</h2>
            </div>
            <div className="wordify-winner">
              <FaTrophy />
            </div>
            <Confetti width={dimensions.width} height={dimensions.height} />
            <ShareAchievement
              totalPoints={totalPoints}
              currentLevel={currentLevel}
            />
          </div>
        </>
      ) : (
        <>
          {onLevelsPage && renderLevelsPage()}
          {hasStarted && (
            <>
              <div className="wordify-button-container">
                <button className="wordify-exit-button" onClick={handleExit}>
                  <FaTimes />
                </button>
                <button
                  className="wordify-back-button"
                  onClick={handleSaveAndExit}
                >
                  <FaArrowLeft />
                </button>
              </div>
              <header className="wordify-app-header">
                <h1>Wordify - Word Creation Game</h1>
              </header>
              <div className="wordify-main">
                <div className="wordify-hourglass"></div>
                <div className="wordify-timer-container">
                  <h4 className="wordify-timerheader">
                    Time Remaining: {Math.floor(timeRemaining / 60)}:
                    {String(timeRemaining % 60).padStart(2, "0")}
                  </h4>
                </div>
                <h4>Points: {points}</h4>
                <h2>
                  <span>Level {currentLevel}</span>
                </h2>
                <span> {getLevelText()}</span>
                <div className="wordify-letter-container">
                  {randomLetters.map((letter, index) => (
                    <div
                      key={index}
                      className={`wordify-letter ${
                        index <= currentLetterIndex
                          ? "wordify-visible"
                          : "wordify-hidden"
                      }`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="wordify-input-container">
                  <input
                    type="text"
                    value={inputWord}
                    onChange={handleInputChange}
                    placeholder="Enter your word here..."
                    disabled={timerExpired}
                  />
                  <button
                    className="wordify-submit-button"
                    onClick={handleSubmit}
                    disabled={timerExpired}
                  >
                    <FaArrowRight size={24} color="white" />
                  </button>
                </div>
                <div className="wordify-parent-container">
                  <div>
                    <h3>Your Words</h3>
                    <div className="wordify-words-container">
                      <div className="wordify-words-list">
                        {userWords.map((word, index) => (
                          <div key={index}>{word}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {timerExpired && (
                    <div>
                      <h3>AI-Generated Words</h3>
                      <div className="wordify-words-container">
                        <div className="wordify-words-list">
                          {aiWords.map((word, index) => (
                            <div key={index}>{word}</div>
                          ))}
                        </div>
                      </div>
                      {currentLevel < 10 && (
                        <>
                          <button
                            onClick={handleNextLevel}
                            className="wordify-next-button"
                          >
                            Next <FaArrowRight size={16} />
                          </button>
                          <button
                            onClick={handleSaveAndExit}
                            className="wordify-next-button"
                          >
                            Save and Exit
                          </button>
                        </>
                      )}
                      {currentLevel === 10 && (
                        <button
                          onClick={() => setOnEndPage(true)}
                          className="wordify-finish-button"
                        >
                          Finish
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
      {showSaveExitPopup && (
        <div className="wordify-popup-overlay">
          <div className="wordify-popup">
            <h3>Game Saved!</h3>
            <p>You will start at the current level when you return.</p>
            <ShareAchievement
              totalPoints={totalPoints}
              currentLevel={currentLevel}
            />
            <button
              onClick={() => {
                setShowSaveExitPopup(false);
                setHasStarted(false);
                setOnLevelsPage(true);
              }}
              className="wordify-popup-close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wordify;
