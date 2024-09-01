import React, { useState, useEffect, useCallback } from 'react';
import { CirclesWithBar } from 'react-loader-spinner';
import { ImHeart, ImLock, ImHeartBroken } from "react-icons/im";
import { saveAs } from 'file-saver';
import './TextTag.css';

const labelMapping = {
  PERSON: "Person",
  ORG: "Organization",
  GPE: "GPE",
  LOC: "Location",
  NORP: "Nationalities or Religious or Political Groups",
  DATE: "Date",
  TIME: "Time",
  MONEY: "Money",
  PERCENT: "Percent",
  FAC: "Facility",         
  CARDINAL: "Cardinal",   
};

const simplifiedLabelMapping = {
  Location: ["GPE", "LOC"]
};

function TextTaggingGame() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [text, setText] = useState("");
  const [predictedTags, setPredictedTags] = useState([]);
  const [level, setLevel] = useState(1);
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [showNextLevelButton, setShowNextLevelButton] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLevelsPage, setShowLevelsPage] = useState(false);
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [lives, setLives] = useState(3);
  const [submissionMade, setSubmissionMade] = useState(false);
  const [savedGame, setSavedGame] = useState(false);
  const [savedLevel, setSavedLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([1]); // Initialize with level 1 completed
  const [gameCompleted, setGameCompleted] = useState(false);


  const fetchSentence = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5002/api/texttag/get_sentence?level=${level}`);
      const data = await response.json();
      setText(data.sentence);
    } catch (error) {
      console.error("Error fetching sentence:", error);
    } finally {
      setLoading(false);
    }
  }, [level]);

  const fetchPredictedTags = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/texttag/get_predicted_tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text })
      });
      const data = await response.json();
      setPredictedTags(data.predicted_tags || []);
      setTimer(60);
      setTimerActive(true);
    } catch (error) {
      console.error("Error fetching predicted tags:", error);
    } finally {
      setLoading(false);
    }
  }, [text]);

  useEffect(() => {
    if (gameStarted) {
      fetchSentence();
    }
  }, [fetchSentence, gameStarted]);

  useEffect(() => {
    if (text && gameStarted) {
      fetchPredictedTags();
    }
  }, [text, fetchPredictedTags, gameStarted]);

  useEffect(() => {
    let timerInterval;
    if (timerActive) {
      timerInterval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            setTimerActive(false);
            setTimerExpired(true);
            clearInterval(timerInterval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [timerActive]);

  const handleTimerExpired = useCallback(() => {
    if (!submissionMade) {
      setLives(prevLives => Math.max(prevLives - 1, 0));
      setTimerExpired(true);
      setShowRetryButton(true);
    }
  }, [submissionMade]);

  useEffect(() => {
    if (timer === 0) {
      handleTimerExpired();
    }
  }, [timer, handleTimerExpired]);

  const makeWordsClickable = useCallback(() => {
    const textElement = document.getElementById("taggable-text");
    if (textElement && !submissionMade) {
      const entityWords = predictedTags.map(entity => entity.key);
      entityWords.sort((a, b) => b.length - a.length);
      const escapedEntityWords = entityWords.map(word => word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
      const regexPattern = new RegExp(`(${escapedEntityWords.join('|')})`, 'gi');
      const formattedText = text.replace(regexPattern, (match) => {
        return `<span class="clickable-word" data-word="${match}">${match}</span>`;
      });
      textElement.innerHTML = formattedText;
    }
  }, [text, predictedTags, submissionMade]);

  const addWordToSelected = useCallback((word) => {
    const wordExists = selectedWords.some(sw => sw.word.toLowerCase() === word.toLowerCase());
    if (wordExists) {
      setSelectedWords(prev => prev.filter(sw => sw.word.toLowerCase() !== word.toLowerCase()));
    } else {
      const entity = predictedTags.find(ent => ent.key.toLowerCase() === word.toLowerCase());
      if (entity) {
        setSelectedWords(prev => [...prev, { word: entity.key, label: '' }]);
      }
    }
  }, [predictedTags, selectedWords]);

  const handleTagChange = useCallback((word, newLabel) => {
    setSelectedWords(prev =>
      prev.map(item => item.word.toLowerCase() === word.toLowerCase() ? { ...item, label: newLabel } : item)
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selectedWords.length === 0 || selectedWords.some(word => word.label === '')) {
      setFeedbackMessage("Please select and tag all selected words before submitting.");
      return;
    }
    setTimerActive(false);
    setSubmissionMade(true);
  
    let feedbackMessage = "Results:<br>";
    let earnedTokens = 0;
    let correctCount = 0;
    let incorrectCount = 0;
  
    const userAnnotations = selectedWords.map(selectedWord => ({
      key: selectedWord.word,
      tag: selectedWord.label
    }));

    const response = await fetch('http://localhost:5002/api/texttag/save_annotation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence: text, annotations: userAnnotations, level })
    });

    const data = await response.json();
  
    selectedWords.forEach(selectedWord => {
      const { word, label } = selectedWord;
      const correctTagEntry = predictedTags.find(({ key }) =>
        key.toLowerCase() === word.toLowerCase()
      );
      const correctTag = correctTagEntry ? correctTagEntry.tag : null;
      const isCorrect = correctTag && (label === correctTag || simplifiedLabelMapping[label]?.includes(correctTag));
      if (isCorrect) {
        correctCount++;
        feedbackMessage += `${word}: Correct (${labelMapping[label]})<br>`;
      } else {
        const expectedTag = correctTag ? labelMapping[correctTag] : "None";
        feedbackMessage += `${word}: Incorrect (Expected ${expectedTag}, Got ${labelMapping[label] || "None"})<br>`;
        incorrectCount++;
      }
    });
  
    if (incorrectCount > 0) {
      setLives(prevLives => Math.max(prevLives - 1, 0));
    }
  
    // Calculate total correct annotations
    const totalCorrectAnnotations = selectedWords.filter(({ word, label }) => {
      const correctTagEntry = predictedTags.find(({ key }) =>
        key.toLowerCase() === word.toLowerCase()
      );
      const correctTag = correctTagEntry ? correctTagEntry.tag : null;
      return correctTag && (label === correctTag || simplifiedLabelMapping[label]?.includes(correctTag));
    }).length;
  
    feedbackMessage += `<br>Correct Annotations: ${totalCorrectAnnotations}<br>`;
    // Remove the line that uses `totalAnnotations` if not needed
    // feedbackMessage += `Total Annotations: ${totalAnnotations}<br>`; 
  
    if (correctCount >= (selectedWords.length / 2)) {
      earnedTokens = level === 1 ? 5 : level === 2 ? 10 : 15;
      setShowNextLevelButton(true);
      setShowRetryButton(false);
      setCompletedLevels(prevLevels => [...new Set([...prevLevels, level + 1])]); // Unlock next level
    } else {
      earnedTokens = level === 1 ? 0 : level === 2 ? 0 : 0;
      setShowRetryButton(true);
      setShowNextLevelButton(false);
    }
  
    setTotalTokens(prevTokens => prevTokens + earnedTokens);
    feedbackMessage += `Reward Tokens: ${earnedTokens}`;
    setFeedbackMessage(feedbackMessage);
  }, [selectedWords, text, predictedTags, level]);
  
  



  const handleNextLevel = useCallback(() => {
    if (level === 10) {
      // If the current level is 10, display the Game Over screen
      setGameCompleted(true);
    } else if (completedLevels.includes(level + 1)) {
      // Move to the next level if it's unlocked
      setLevel(prevLevel => prevLevel + 1);
      setSelectedWords([]);
      setFeedbackMessage('');
      setShowRetryButton(false);
      setShowNextLevelButton(false);
      setSubmissionMade(false);
      fetchSentence();
    }
  }, [level, completedLevels, fetchSentence]);
  

  const handleRetry = useCallback(() => {
    setSelectedWords([]);
    setFeedbackMessage('');
    setText('');
    setPredictedTags([]);
    setShowRetryButton(false);
    setTimerExpired(false);
    setSubmissionMade(false);
    setTimer(60); // Reset the timer to its initial value
    setTimerActive(true);
    fetchSentence();
  
    // Fetch the predicted tags again for the current sentence
    fetchPredictedTags();
  }, [fetchPredictedTags]);
  

  const handlePlayAgain = useCallback(async () => {
    setLoading(true);
    setGameCompleted(false);
    setGameStarted(true);
    setTimerActive(true);
    setTimerExpired(false);
    setSelectedWords([]);
    setFeedbackMessage('');
    setShowRetryButton(false);
    setShowNextLevelButton(false);
    setLives(3);
    setSubmissionMade(false);
    setLevel(1); // Always start from level 1
    setTotalTokens(0); // Reset tokens
    setCompletedLevels([1]); // Reset completed levels
    setText("");
    setPredictedTags([]);
    try {
      await fetchSentence();
      await fetchPredictedTags();
      makeWordsClickable();
  } catch (error) {
    console.error("Error resetting game state:", error);
  } finally {
      setLoading(false);
  }
}, [fetchSentence, fetchPredictedTags,makeWordsClickable]);

  const handleMenu = () => {
    setTimerExpired(false);
    setGameStarted(false);
    setShowLevelsPage(false);
  };

  const handleSaveAndExit = () => {
    const data = JSON.stringify({ level, totalTokens, lives, completedLevels });
    const blob = new Blob([data], { type: "application/json" });
    saveAs(blob, "progress.json");
    setGameStarted(false);
    setShowLevelsPage(false);
    setSavedGame(true); // Mark game as saved
    setSavedLevel(level); // Save the current level
    setTimerActive(false);
  };

  const handleContinue = useCallback(async () => {
    setLoading(true);
    setSavedGame(false); // Reset saved game state
    setGameStarted(true);
    setSelectedWords([]);
    setFeedbackMessage('');
    setShowRetryButton(false);
    setShowNextLevelButton(false);
    setLives(3);
    setLevel(savedLevel); // Continue from saved level
    
    try {
        await fetchSentence();          // Fetch the sentence
        await fetchPredictedTags();     // Fetch the predicted tags
    } catch (error) {
        console.error("Error during continue:", error);

    } finally {
        setLoading(false); // Set loading to false after both fetches complete
    }
}, [selectedWords, text, predictedTags, level]);

  useEffect(() => {
    makeWordsClickable();
  
    const textElement = document.getElementById("taggable-text");
    if (textElement) {
      const handleWordClick = (event) => {
        if (!submissionMade) {
          const word = event.target.dataset.word;
          if (word) {
            addWordToSelected(word);
          }
        }
      };
      textElement.addEventListener("click", handleWordClick);
  
      // Clean up the event listener when the component unmounts or dependencies change
      return () => {
        textElement.removeEventListener("click", handleWordClick);
      };
    }
  }, [text, predictedTags, submissionMade, makeWordsClickable, addWordToSelected]);
  

  return (
    <div className="ttg-wrapper">
    <div className="ttg-container">
      {loading && (
        <div id="loading-screen">
          <CirclesWithBar
            height="100"
            width="100"
            color="#4fa94d"
            outerCircleColor="#0237ab"
            innerCircleColor="#0237ab"
            barColor="#0237ab"
            ariaLabel="Loading.."
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p><b>Loading...</b></p>
        </div>
      )}
      {!loading && gameStarted && !timerExpired && lives > 0 && !gameCompleted ? (
        <div id="game-container">
          <div id="level-container">
            <h2>Level: {level}</h2>
          </div>
          <div id="text-container">
            <div id="lives-container">
            {Array.from({ length: 3 }, (_, i) => (
        <span key={i} className={`heart ${i < lives ? 'active' : 'inactive'}`}>
          {i < lives ? <ImHeart /> : <ImHeartBroken />}
        </span>
      ))}
            </div>
            <p id="taggable-text"></p>
          </div>
          <div id="selected-words-container">
            <h3>Selected Words:</h3>
            <ul>
              {selectedWords.map((selectedWord, index) => (
                <li key={index}>
                  {selectedWord.word}
                  <select
                    value={selectedWord.label}
                    onChange={(e) => handleTagChange(selectedWord.word, e.target.value)}
                  >
                    <option value="">Select Tag</option>
                    {Object.entries(labelMapping).map(([tag, label]) => (
                      <option key={tag} value={tag}>{label}</option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </div>
          <div id="actions-container">
            {!submissionMade && <button onClick={handleSubmit}>Submit</button>}
          </div>
          {showRetryButton && (
            <div id="retry-container">
              <button onClick={() => handleRetry()}>Retry</button>
            </div>
          )}
          {showNextLevelButton && (
            <div id="next-level-container">
              <button onClick={() => handleNextLevel()}>Next Level</button>
            </div>
          )}
          <div id="feedback-container">
            <p dangerouslySetInnerHTML={{ __html: feedbackMessage }} />
          </div>
          <div id="tokens-container">
            <p>Total Tokens: {totalTokens}</p>
          </div>
          <div id="timer-container">
            <p>Time Left: {timer}s</p>
          </div>
          <div id="save-exit-container">
            {!submissionMade && (
              <button onClick={() => handleSaveAndExit()}>Save and Exit</button>
            )}
          </div>
        </div>
      ) : (
        !loading && !gameStarted && (
          <div id="menu-container">
            <p><b>Welcome to the Text Tagging Game</b></p>
            <p>Click on the <b>Start Game</b> button to start the game</p>
            <p>Click on the <b>Levels</b> button to select the level</p>
            <button onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setGameStarted(true);
              }, 1000);
            }}>Start Game</button>
            <button onClick={() => setShowLevelsPage(prevState => !prevState)}>Levels</button>
            <button onClick={handlePlayAgain}>New Game</button> {/* New Game Button */}
            {savedGame && (
              <div id="continue-container">
                <p><b>Your game progress has been saved!</b></p>
                <button onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    handleContinue();
                    setLoading(false);
                  }, 1000);
                }}>Continue</button>
              </div>
            )}
          </div>
        )
      )}
      {showLevelsPage && !gameStarted && (
        <div id="levels-page">
          <h2>Select Level</h2>
          <div id="levels-container">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (completedLevels.includes(i + 1)) {
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      setLevel(i + 1);
                      setGameStarted(true);
                    }, 1000);
                  }
                }}
                disabled={!completedLevels.includes(i + 1)}
              >
                Level {i + 1}
                {!completedLevels.includes(i + 1) && <ImLock />}
              </button>
            ))}
          </div>
        </div>
      )}
      {timerExpired && lives > 0 && (
        <div id="timer-expired-container">
          <h2>Time Expired!</h2>
          <button onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              handleRetry();
            }, 1000);
          }}>Retry</button>
          <button onClick={() => handleMenu()}>Main Menu</button>
        </div>
      )}
      {lives === 0 && !gameCompleted && (
        <div id="game-over-container">
          <h2>Game Over!</h2>
          <p>Total Tokens: {totalTokens}</p>
          <p>Lives Remaining: {lives}</p>
          <button onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              handlePlayAgain();
            }, 1000);
          }}>Play Again</button>
          <button onClick={() => handleMenu()}>Main Menu</button>
        </div>
      )}
      {gameCompleted && (
            <div id="game-completed-container">
                <h2>Congratulations! You've Completed the Game!</h2>
                <p>Total Tokens: {totalTokens}</p>
                <p>Lives Remaining: {lives}</p>
                <button onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              handlePlayAgain();
            }, 1000);
          }}>Play Again</button>
                <button onClick={() => handleMenu()}>Main Menu</button>
            </div>
        )}
    </div>
    </div>
  );
}

export default TextTaggingGame;