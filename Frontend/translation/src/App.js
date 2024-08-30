// App.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FaShareAlt, FaBars, FaHome, FaList, FaSave, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import backgroundImage from './B.png';
import LevelSelection from './LevelSelection';
import TranslationTask from './TranslationTask';
import GameOver from './GameOver';
import WelcomePage from './WelcomePage';
import InstructionPopup from './InstructionPopup';
import ShareAchievement from './ShareAchievement';

const App = () => {
    const [showWelcomePage, setShowWelcomePage] = useState(true);
    const [isMainScreen, setIsMainScreen] = useState(false);
    const [showInstructionPopup, setShowInstructionPopup] = useState(false);
    const [unlockedLevels, setUnlockedLevels] = useState(1);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [totalTokens, setTotalTokens] = useState(0);
    const [stars, setStars] = useState(Array(10).fill(0));
    const [gameOver, setGameOver] = useState(false);
    const [shareAchievement, setShareAchievement] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [completedLevels, setCompletedLevels] = useState([]);

    useEffect(() => {
        if (currentLevel === 10) {
            setGameOver(true);
        }
    }, [currentLevel]);

    const handleLevelClick = (level) => {
        if (level <= unlockedLevels) {
            setCurrentLevel(level);
            setIsMainScreen(false);
        }
    };

    const handleLevelCompletion = (level, reward, starsEarned) => {
        if (!completedLevels.includes(level)) {
            setTotalTokens(prevTokens => prevTokens + reward);
            setCompletedLevels(prevCompletedLevels => [...prevCompletedLevels, level]);
        }

        setStars(prevStars => {
            const newStars = [...prevStars];
            newStars[level - 1] = starsEarned;
            return newStars;
        });

        setTimeout(() => {
            if (level < 10) {
                setUnlockedLevels(prevUnlocked => Math.max(prevUnlocked, level + 1));
                setCurrentLevel(null);
                setIsMainScreen(true);
            } else {
                   setGameOver(true);
            }
        }, 3000);
    };

    const startGame = () => {
        setShowWelcomePage(false);
        setIsMainScreen(true);
        setShowInstructionPopup(true);
    };

    const closeInstructionPopup = () => {
        setShowInstructionPopup(false);
    };

    const goToLevelSelection = () => {
        setCurrentLevel(null);
        setIsMainScreen(false);
        setShowMenu(false);
    };

    const goToShareAchievement = () => {
        setGameOver(false);
        setShareAchievement(true);
    };

    const handleCloseShareAchievement = () => {
        setShareAchievement(false);
        setGameOver(true);
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleMenuItemClick = (action) => {
        switch (action) {
            case 'home':
                setShowWelcomePage(true);
                setIsMainScreen(false);
                setCurrentLevel(null);
                setGameOver(false);
                setShareAchievement(false);
                break;
            case 'levelSelection':
                goToLevelSelection();
                break;
            case 'save':
                console.log('Save functionality placeholder');
                break;
            case 'exit':
                console.log('Exit functionality placeholder');
                break;
            case 'instruction':
                setShowInstructionPopup(true);
                break;
            default:
                console.log('Unhandled menu action:', action);
                break;
        }
        setShowMenu(false);
    };

    return (
        <Container onClick={() => showMenu && setShowMenu(false)}>
            {showWelcomePage ? (
                <WelcomePage onStart={startGame} />
            ) : isMainScreen ? (
                <Card
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Title
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Translation To Earn
                    </Title>
                    <StartButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMainScreen(false)}
                    >
                        Start
                    </StartButton>
                </Card>
            ) : gameOver ? (
                <>
                    <GameOver totalTokens={totalTokens} />
                    <ShareIcon onClick={goToShareAchievement} />
                </>
            ) : shareAchievement ? (
                <ShareAchievement onClose={handleCloseShareAchievement} />
            ) : currentLevel ? (
                <TranslationTask
                    level={currentLevel}
                    handleLevelCompletion={handleLevelCompletion}
                    stars={stars[currentLevel - 1]}
                />
            ) : (
                <LevelSelection
                    unlockedLevels={unlockedLevels}
                    handleLevelClick={handleLevelClick}
                    stars={stars}
                    completedLevels={completedLevels}
                />
            )}
            {showInstructionPopup && <InstructionPopup isOpen={showInstructionPopup} onClose={closeInstructionPopup} />}
            
            {!showWelcomePage && !showInstructionPopup && (
                <>
                    <MenuIcon onClick={toggleMenu}>
                        <FaBars />
                    </MenuIcon>
                    <AnimatePresence>
                        {showMenu && (
                            <MenuDropdown
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MenuItem onClick={() => handleMenuItemClick('home')}>
                                    <FaHome /> Home
                                </MenuItem>
                                {currentLevel && !gameOver && (
                                    <>
                                        <MenuItem onClick={() => handleMenuItemClick('levelSelection')}>
                                            <FaList /> Level Selection
                                        </MenuItem>
                                        <MenuItem onClick={() => handleMenuItemClick('save')}>
                                            <FaSave /> Save
                                        </MenuItem>
                                        <MenuItem onClick={() => handleMenuItemClick('exit')}>
                                        <FaSignOutAlt /> Exit
                                        </MenuItem>
                                    </>
                                )}
                                {!gameOver && (
                                    <MenuItem onClick={() => handleMenuItemClick('instruction')}>
                                        <FaQuestionCircle /> Instruction
                                    </MenuItem>
                                )}
                            </MenuDropdown>
                        )}
                    </AnimatePresence>
                </>
            )}
        </Container>
    );
};

// Styled Components 
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 100%;
  width: 500px;
`;

const Title = styled(motion.h1)`
  color: #9c9cfe;
  text-shadow: 1px 1px 2px #000000, 0 0 25px #9c9cfe, 0 0 5px #9c9cfe;
  font-size: 3rem;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StartButton = styled(motion.button)`
  background: #9c9cfe;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #6200ea;
    box-shadow: 1px 1px 2px #000000, 0 0 25px #9c9cfe, 0 0 5px #9c9cfe;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 12px 24px;
  }
`;

const ShareIcon = styled(FaShareAlt)`
  position: absolute;
  top: 65px;
  right: 20px;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #9c9cfe;
  }
`;

const MenuIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #9c9cfe;
  }
`;

const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: 60px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(156, 156, 254, 0.2);
  }

  svg {
    margin-right: 10px;
  }
`;

export default App;