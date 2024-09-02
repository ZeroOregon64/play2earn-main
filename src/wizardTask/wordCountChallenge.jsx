import React, { useState, useEffect } from "react";
import { fetchParagraphs, submitAnswer } from "../wizardTask/apiservices";
import { AlignJustify, Home, ArrowRight, Check, X } from "lucide-react";
import { FaHeart } from "react-icons/fa";

const WordCountChallenge = () => {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [score, setScore] = useState(0);
  const [paragraphs, setParagraphs] = useState([]);
  const [lives, setLives] = useState(3);
  const [fetchError, setFetchError] = useState(null);
  const [timer, setTimer] = useState(60);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [returnTimer, setReturnTimer] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);  

  useEffect(() => {
    const storedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
    setCompletedLevels(storedLevels);
    const storedReturnTimer = JSON.parse(localStorage.getItem('returnTimer'));
    if (storedReturnTimer) setReturnTimer(storedReturnTimer);
  }, []);

  useEffect(() => {
    if (currentLevel !== null) {
      const fetchData = async () => {
        try {
          const data = await fetchParagraphs(currentLevel);
          setParagraphs(data);
        } catch (error) {
          setFetchError('Failed to fetch paragraphs. Please try again later.');
        }
      };
      fetchData();
    }
  }, [currentLevel]);

  useEffect(() => {
    let intervalId;
    if (currentLevel !== null && lives > 0 && !isTimeUp) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(intervalId);
            handleTimeUp();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [currentLevel, lives, isTimeUp]);

  const handleStartLevel = (level) => {
    // Commented out the wait logic
    /*
    if (returnTimer && Date.now() < returnTimer) {
      alert('Please wait before starting a new game.');
      return;
    }
    */
    
    // Proceed with setting the current level and resetting the timer
    setCurrentLevel(level);
    setTimer(60);
    setIsTimeUp(false);
  };
  const handleBackToHome = () => {
    setCurrentLevel(null);
    // No need to reset the score; it will persist across levels
  };

  const handleNextLevel = () => {
    if (currentLevel < 10) {
      markLevelCompleted(currentLevel); // Lock the completed level
      setCurrentLevel(currentLevel + 1); // Move to the next level
    }
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setSubmitDisabled(true);

    setLives((prevLives) => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        const newReturnTimer = Date.now() + 24 * 60 * 60 * 1000;
        setReturnTimer(newReturnTimer); // This should now work
        localStorage.setItem("returnTimer", JSON.stringify(newReturnTimer));
      }
      return newLives;
    });
  };
  const markLevelCompleted = (level) => {
    if (completedLevels.includes(level)) return; // Prevent duplicates

    const updatedLevels = [...completedLevels, level];
    setCompletedLevels(updatedLevels);
    localStorage.setItem('completedLevels', JSON.stringify(updatedLevels));

    setCurrentLevel(null); // Return to the home screen after completion
  };

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 3; i++) {
      hearts.push(
        <FaHeart
          key={i}
          className={`heart ${i < lives ? 'text-red-500' : 'text-white'}`} 
        />
      );
    }
    return hearts;
  };

  const calculateCountdown = () => {
    if (!returnTimer) return "24:00:00";

    const remainingTime = returnTimer - Date.now();

    if (remainingTime <= 0) {
      // Cooldown period is over
      return "00:00:00";
    }

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(remainingTime / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {currentLevel === null ? (
        <HomeScreen
          onStartLevel={handleStartLevel}
          completedLevels={completedLevels}
        />
      ) : (
        <GameScreen
          level={currentLevel}
          paragraphs={paragraphs}
          onBackToHome={handleBackToHome}
          onNextLevel={handleNextLevel}
          score={score}
          setScore={setScore}
          lives={lives}
          setLives={setLives}
          renderHearts={renderHearts}
          timer={timer}
          isTimeUp={isTimeUp}
          onLevelComplete={() => markLevelCompleted(currentLevel)}
          returnTimer={returnTimer}
          calculateCountdown={calculateCountdown}
          setSubmitDisabled={setSubmitDisabled}
          setReturnTimer={setReturnTimer} 
        />
      )}
      {fetchError && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-red-600 text-white text-center">
          {fetchError}
        </div>
      )}
    </div>
  );
};

const HomeScreen = ({ onStartLevel, completedLevels }) => {
  const maxUnlockedLevel = completedLevels.length + 1; // Only allow access to the next level

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white">
      <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center animate-pulse">
        Word Wizard Challenge
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => {
          const level = index + 1;
          const isUnlocked = level === maxUnlockedLevel;

          return (
            <button
              key={index}
              onClick={() => isUnlocked && onStartLevel(level)}
              className={`py-4 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform ${
                isUnlocked
                  ? "bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 hover:scale-105"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!isUnlocked} // Disable button if not unlocked
            >
              Level {level}
            </button>
          );
        })}
      </div>
    </div>
  );
};


const GameScreen = ({
  level,
  paragraphs,
  onBackToHome,
  onNextLevel,
  score,
  setScore,
  lives,
  setLives,
  renderHearts,
  timer,
  isTimeUp,
  onLevelComplete,
  returnTimer,
  calculateCountdown,
  submitDisabled,
  setSubmitDisabled,
  setReturnTimer 
}) => {
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [inputs, setInputs] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [message, setMessage] = useState("");

  const currentParagraph = paragraphs[currentParagraphIndex];
  const isLevelTen = level === 10;

  useEffect(() => {
    setCurrentParagraphIndex(0);
    setInputs({});
    setCorrectAnswers(0);
    setMessage("");
    setSubmitDisabled(false);
  }, [level]);

  useEffect(() => {
    let intervalId;
    if (returnTimer) {
      intervalId = setInterval(() => {
        setCountdown(calculateCountdown());
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [returnTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const data = await submitAnswer(currentParagraph._id, {
        word1count: parseInt(inputs.word, 10),
        word2count: 0 
      });
  
      if (data.correct) {
        // Correct answer logic
        setScore(prevScore => prevScore + data.points);
        setCorrectAnswers(prevCount => prevCount + 1);
        setMessage(`Magic! You've earned ${data.points} mystical points!`);
        setSubmitDisabled(true); // Disable submit after a correct answer
  
        // Check if all paragraphs are completed
        if (currentParagraphIndex === paragraphs.length - 1) {
          onLevelComplete(); // Complete the level
        }
      } else {
        // Incorrect answer logic
        handleIncorrectAnswer(data.points);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error.message);
      setMessage(`The answer is incorrect. Try again!`);
      setSubmitDisabled(false); // Allow retry after an incorrect answer
    }
  };
  
  const handleIncorrectAnswer = (points) => {
    // Update lives
    setLives(prevLives => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        // Start retry timer if lives are depleted
        const newReturnTimer = Date.now() + 24 * 60 * 60 * 1000;
        setReturnTimer(newReturnTimer);  // This should work if passed correctly
        localStorage.setItem('returnTimer', JSON.stringify(newReturnTimer));
      }
      return newLives;
    });

    // Update score and correct answer count
    setScore(prevScore => prevScore + points);
    setCorrectAnswers(prevCount => prevCount + 1);

    // Display the incorrect message and disable submission
    setMessage(`The answer is incorrect. Try again!`);
    setSubmitDisabled(true);  // Disable submit after an incorrect answer
  };


  const handleNextParagraph = () => {
    setSubmitDisabled(false);
    setCurrentParagraphIndex(prevIndex => prevIndex + 1);
    setInputs({});
    setMessage("");
  };

  const handleNextLevel = () => {
    if (correctAnswers > 0) onNextLevel();
    else setMessage("You need at least one correct spell to unlock the next level.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-center text-yellow-300 animate-pulse">
            Spell Chamber {level}
          </h2>
          <div className="flex gap-2">
            {/* Render hearts (lives) */}
            {renderHearts()}
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-lg leading-relaxed bg-black/20 p-4 rounded-lg">
            {currentParagraph?.paragraph}
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="text-lg font-semibold">
                Count the magic word '{currentParagraph?.word1}':
              </span>
              <input
                type="number"
                name="word"
                value={inputs.word || ""}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-md bg-white/20 border-transparent focus:border-yellow-300 focus:bg-white/30 focus:ring-0 text-white placeholder-gray-300"
                placeholder="Enter your count"
                disabled={submitDisabled}
              />
            </label>
            {isLevelTen && ( 
              <label className="block">
                <span className="text-lg font-semibold">
                  Count the bonus word '{currentParagraph?.word2}':
                </span>
                <input
                  type="number"
                  name="word2"
                  value={inputs.word2 || ""}
                  onChange={handleInputChange}
                  disabled={submitDisabled}
                  className="mt-2 block w-full rounded-md bg-white/20 border-transparent focus:border-yellow-300 focus:bg-white/30 focus:ring-0 text-white placeholder-gray-300"
                  placeholder="Enter your count"
                />
              </label>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={submitDisabled}
              className="bg-yellow-400 text-indigo-900 font-bold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-300 transition duration-300 ease-in-out disabled:opacity-50 flex items-center"
            >
              <Check className="mr-2" /> Cast Spell
            </button>
            {level < 10 && (
              <>
                <button
                  onClick={handleNextParagraph}
                  disabled={!submitDisabled}
                  className="bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-green-400 transition duration-300 ease-in-out disabled:opacity-50 flex items-center"
                >
                  <AlignJustify className="mr-2" /> Next Scroll
                </button>
                <button
                  onClick={handleNextLevel}
                  disabled={!submitDisabled}
                  className="bg-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-purple-400 transition duration-300 ease-in-out disabled:opacity-50 flex items-center"
                >
                  <ArrowRight className="mr-2" /> Next Chamber
                </button>
              </>
            )}
            {level === 10 && (
              <button
                onClick={handleNextParagraph}
                disabled={!submitDisabled}
                className="bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-green-400 transition duration-300 ease-in-out disabled:opacity-50 flex items-center"
              >
                <AlignJustify className="mr-2" /> Final Scroll
              </button>
            )}
            <button
              onClick={onBackToHome}
              className="bg-red-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-400 transition duration-300 ease-in-out"
            >
              <X className="mr-2" /> Home
            </button>
          </div>
          <div className="text-center mt-6">
            <p className="text-white text-lg">
              Time Remaining: {`${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
            </p>
          </div>
          {returnTimer && !isTimeUp && (
            <div className="text-center mt-6">
              <p className="text-white text-lg">
                Next game available in: {calculateCountdown()}
              </p>
            </div>
          )}
          {isTimeUp && (
            <p className="text-center text-xl font-semibold text-red-500">
              Time's Up!
            </p>
          )}
          {message && (
            <p className="text-center text-xl font-semibold text-yellow-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordCountChallenge;

