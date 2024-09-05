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
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const storedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
    setCompletedLevels(storedLevels);
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
    setCurrentLevel(level);
    setTimer(450);
    setIsTimeUp(false);
  };

  const handleBackToHome = () => {
    setCurrentLevel(null);
  };

  const handleNextLevel = () => {
    if (correctAnswers > 0) {
      markLevelCompleted(level); // Make sure this updates the completedLevels state correctly
      setCurrentLevel(level + 1);
    } else {
      setMessage("You need at least one correct spell to unlock the next level.");
    }
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setSubmitDisabled(true);

    setLives((prevLives) => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        const newReturnTimer = Date.now() + 24 * 60 * 60 * 1000;
        setReturnTimer(newReturnTimer);
        localStorage.setItem("returnTimer", JSON.stringify(newReturnTimer));
      }
      return newLives;
    });
  };
  const markLevelCompleted = (level) => {
    setCompletedLevels((prevLevels) => {
      const updatedLevels = [...prevLevels, level];
      localStorage.setItem('completedLevels', JSON.stringify(updatedLevels));
      return updatedLevels;
    });
  };


  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 3; i++) {
      hearts.push(
        <FaHeart
          key={i}
          className={`text-lg ${i < lives ? 'text-red-500' : 'text-white'}`} 
        />
      );
    }
    return hearts;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {currentLevel === null ? (
        <HomeScreen
          onStartLevel={handleStartLevel}
          completedLevels={completedLevels}
          totalPoints={totalPoints} 
        />
      ) : (
        <GameScreen
          level={currentLevel}
          paragraphs={paragraphs}
          onBackToHome={handleBackToHome}
          onNextLevel={handleNextLevel}
          score={score}
          setScore={setScore}
          totalPoints={totalPoints} 
          setTotalPoints={setTotalPoints} 
          lives={lives}
          setLives={setLives}
          renderHearts={renderHearts}
          timer={timer}
          isTimeUp={isTimeUp}
          onLevelComplete={() => markLevelCompleted(currentLevel)}
          returnTimer={returnTimer}
          submitDisabled={submitDisabled}
          setSubmitDisabled={setSubmitDisabled}
          setReturnTimer={setReturnTimer}
          markLevelCompleted={markLevelCompleted}
          setCurrentLevel={setCurrentLevel}
          
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

const HomeScreen = ({ onStartLevel, completedLevels, totalPoints }) => {
  const initialMaxUnlockedLevel = Math.max(...completedLevels, 1);
  const [currentLevel, setCurrentLevel] = useState(initialMaxUnlockedLevel);

  // Function to determine if a level button should be unlocked
  const isLevelUnlocked = (level) => {
    return level ===  0;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white">
      <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center animate-pulse">
        Word Wizard Challenge
      </h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => onStartLevel(1)}
          className="py-4 px-6 rounded-xl shadow-lg bg-purple-400 text-white font-semibold hover:bg-purple-700"
        >
          Start Game
        </button>
      </div>
      <div className="text-lg mb-6 text-white">
        Total Points: {totalPoints}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => {
          const level = index + 1;
          const isUnlocked = isLevelUnlocked(level);

          return (
            <button
              key={index}
              onClick={() => isUnlocked && onStartLevel(level)}
              className={`py-4 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform ${
                isUnlocked
                  ? "bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 hover:scale-105"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!isUnlocked}
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
  totalPoints, // Receive totalPoints
  setTotalPoints, // Receive setTotalPoints
  lives,
  setLives,
  renderHearts,
  timer,
  isTimeUp,
  onLevelComplete,
  returnTimer,
  submitDisabled,
  setSubmitDisabled,
  setReturnTimer,
  markLevelCompleted,
  setCurrentLevel
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
  };

  const handleSubmit = async () => {
    if (lives <= 0) {
      setMessage('You have no lives left. Please wait until the cooldown period is over.');
      return;
    }
  
    try {
      const data = await submitAnswer(currentParagraph._id, {
        word1count: parseInt(inputs.word, 10),
        word2count: isLevelTen ? parseInt(inputs.word2, 10) : 0
      });
  
      if (data.correct) {
        setScore(prevScore => prevScore + data.points);
        setTotalPoints(prevPoints => prevPoints + data.points); // Update totalPoints
        setCorrectAnswers(prevCount => prevCount + 1);
        setMessage(`Magic! You've earned ${data.points} mystical points!`);
        setSubmitDisabled(true);
      } else {
        handleIncorrectAnswer(data.points);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error.message);
      setMessage('The answer is incorrect. Try again!');
      setSubmitDisabled(false);
    }
  };

  const handleIncorrectAnswer = (points) => {
    setLives((prevLives) => {
      const newLives = prevLives - 1;
  
      if (newLives <= 0) {
        const newReturnTimer = Date.now() + 24 * 60 * 60 * 1000;
        setReturnTimer(newReturnTimer);
        localStorage.setItem('returnTimer', JSON.stringify(newReturnTimer));
        
        // Redirect to Home Screen when lives reach 0
        setCurrentLevel(null); 
        setSubmitDisabled(false);
      }
  
      return newLives;
    });
  
    setScore((prevScore) => prevScore + points);
    setTotalPoints((prevPoints) => prevPoints + points);
    setCorrectAnswers((prevCount) => prevCount + 1);
    setMessage("The answer is incorrect. Try again!");
    setSubmitDisabled(true);
  };

  const handleNextParagraph = () => {
    if (currentParagraphIndex < paragraphs.length - 1) {
      setSubmitDisabled(false);
      setCurrentParagraphIndex(prevIndex => prevIndex + 1);
      setInputs({});
      setMessage("");
    } else {
      setMessage("This was the last scroll in this chamber.");
    }
  };

  const handleNextLevel = () => {
    if (correctAnswers > 0) {
      if (level < 10) { // Prevents advancing beyond level 10
        markLevelCompleted(level);
        setCurrentLevel(level + 1);
      } else {
        setMessage("Congratulations! You have completed the final level.");
      }
    } else {
      setMessage("You need at least one correct spell to unlock the next level.");
    }
  };

  const isNextLevelEnabled = correctAnswers > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <button
        onClick={onBackToHome}
        className="absolute top-4 left-4 p-3 bg-purple-300 rounded-full hover:bg-purple-200 z-30"
      >
        <AlignJustify size={24} />
      </button>
      <div className="absolute top-4 right-4 text-white text-lg font-bold z-20">
        Total Points: {totalPoints}
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8 max-w-full md:max-w-2xl w-full text-white relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-yellow-300 animate-pulse">
            Spell Chamber level {level}
          </h2>
          <div className="flex gap-2 mt-4 md:mt-0">
            {renderHearts()}
          </div>
        </div>
        <div className="space-y-4 md:space-y-6">
          <p className="text-sm md:text-base lg:text-lg leading-relaxed bg-black/20 p-4 rounded-lg">
            {currentParagraph?.paragraph}
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm md:text-base lg:text-lg font-semibold">
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
                <span className="text-sm md:text-base lg:text-lg font-semibold">
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
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <button
              onClick={handleSubmit}
              disabled={submitDisabled || lives <= 0}
              className="bg-yellow-400 text-indigo-900 font-bold py-2 px-4 text-sm md:py-2 md:px-6 md:text-base rounded-full shadow-lg hover:bg-yellow-300 transition duration-300 ease-in-out disabled:opacity-50 flex items-center w-full md:w-auto z-20"
            >
              <Check className="mr-2" /> Cast Spell
            </button>
            <button
              onClick={handleNextParagraph}
              disabled={currentParagraphIndex >= paragraphs.length - 1}
              className="bg-green-500 text-white font-bold py-2 px-4 text-sm md:py-2 md:px-6 md:text-base rounded-full shadow-lg hover:bg-green-400 transition duration-300 ease-in-out flex items-center w-full md:w-auto z-20"
            >
              <AlignJustify className="mr-2" /> Next Scroll
            </button>
            {level <= 10 && (
              <button
                onClick={handleNextLevel}
                disabled={!isNextLevelEnabled}
                className="bg-purple-500 text-white font-bold py-2 px-4 text-sm md:py-2 md:px-6 md:text-base rounded-full shadow-lg hover:bg-purple-400 transition duration-300 ease-in-out flex items-center w-full md:w-auto z-20"
              >
                <ArrowRight className="mr-2" /> Next Chamber
              </button>
            )}
          </div>
          <div className="text-center mt-4 md:mt-6">
            <p className="text-white text-sm md:text-base lg:text-lg">
              Time Remaining: {`${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
            </p>
          </div>
  
          {isTimeUp && (
            <p className="text-center text-lg md:text-xl lg:text-2xl font-semibold text-red-500">
              Time's Up!
            </p>
          )}
          {message && (
            <p className="text-center text-lg md:text-xl lg:text-2xl font-semibold text-yellow-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default WordCountChallenge;
