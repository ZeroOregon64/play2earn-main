// LevelSelection.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import lockIcon from './Lock.png'; 

const LevelSelection = ({ unlockedLevels, handleLevelClick, stars, completedLevels }) => {
  return (
      <LevelCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
      >
          <LevelTitle>Choose Your Level</LevelTitle>
          <LevelGrid>
              {[...Array(10)].map((_, index) => (
                  <LevelButton
                      key={index}
                      onClick={() => handleLevelClick(index + 1)}
                      unlocked={index + 1 <= unlockedLevels}
                      completed={completedLevels.includes(index + 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                  >
                      <LevelNumber>{index + 1}</LevelNumber>
                      {index + 1 > unlockedLevels && <LockIcon />}
                      <StarsContainer>
                          {[...Array(3)].map((_, starIndex) => (
                              <Star key={starIndex} filled={stars[index] > starIndex}>
                                  ★
                              </Star>
                          ))}
                      </StarsContainer>
                  </LevelButton>
              ))}
          </LevelGrid>
      </LevelCard>
  );
};

// Styled Components
const LevelCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 90%;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px auto;

  @media (max-width: 768px) {
    padding: 20px;
    width: 90%;
  }
`;

const LevelTitle = styled.h1`
  font-size: 3rem;
  color: #9c9cfe;
  text-shadow: 1px 1px 2px #000000, 0 0 25px #9c9cfe, 0 0 5px #9c9cfe;
  margin-bottom: 2rem;
  font-family: 'Press Start 2P', cursive;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
`;

const LevelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  max-width: 500px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 1rem;
  }
`;

const LevelButton = styled(motion.button)`
  width: 100%;
  padding-top: 100%;
  border-radius: 10px;
  border: none;
  background: ${props => 
    props.completed ? 'linear-gradient(135deg, #4CAF50, #45a049)' :
    props.unlocked ? 'linear-gradient(135deg, #9c9cfe, #6a6aff)' : 
    'linear-gradient(135deg, #d3b673, #a67c00)'};
  color: white;
  font-size: 2rem;
  font-weight: bold;
  cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.unlocked ? 
    '0 6px 12px rgba(0, 0, 0, 0.3), 0 0 25px #9c9cfe, 0 0 5px #9c9cfe' : 
    '0 3px 6px rgba(0, 0, 0, 0.1)'};
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:hover {
    transform: ${props => props.unlocked ? 'translateY(-5px)' : 'none'};
    box-shadow: ${props => props.unlocked ? 
      '0 8px 16px rgba(0, 0, 0, 0.3), 0 0 25px #9c9cfe, 0 0 5px #9c9cfe' : 
      'none'};
  }

  &:active {
    transform: ${props => props.unlocked ? 'translateY(-2px)' : 'none'};
  }
`;


const LevelNumber = styled.span`
  font-size: 2.2rem;
  font-weight: bold;
  color: White;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Press Start 2P', cursive;
`;

const LockIcon = styled.span`
  width: 25px;
  height: 25px;
  background-image: url(${lockIcon});
  background-size: contain;
  position: absolute;
  top: 4px;
  right: -4px;
  background-repeat: no-repeat;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));
`;

const StarsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 1.5px;
  left: 50%;
  transform: translateX(-50%);
`;

const Star = styled.span`
  font-size: 1.2rem;
  color: ${props => props.filled ? '#E5B80B' : '#555'};
  margin: 0 2.5px;
  font-family: 'Press Start 2P', cursive;
`;

export default LevelSelection;
