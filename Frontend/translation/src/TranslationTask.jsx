// TranslationTask.jsx
import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Heart animation
const heartBeat = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
`;

// Timer animation
const timerAnimation = keyframes`
  0% {
    color: #9c9cfe;
  }
  100% {
    color: #ff0000;
  }
`;

const blink = keyframes`
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: black;
  }
`;

// Styled components
const TaskContainer = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Title = styled.h2`
  margin-bottom: -1rem;
  color: #9c9cfe;
  text-shadow: 1px 1px 2px #000000, 0 0 25px #9c9cfe, 0 0 5px #9c9cfe;
  font-size: 3rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FrenchLabel = styled.span`
  font-size: 2rem;
  color: #9c9cfe;
  text-shadow: 1px 1px 2px #000000, 0 0 25px #9c9cfe, 0 0 5px #9c9cfe;
  margin-right: 10px;
  white-space: nowrap; 
`;

const FrenchText = styled.span`
  font-weight: bold;
  font-size: 2rem;
  color: #E5B80B;
  text-shadow: 1px 1px 2px #000000, 0 0 5px #E5B80B;
  white-space: pre-wrap;
  flex-shrink: 1;

`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 18px;
  margin-bottom: 1.5rem;
  resize: none;
  height: 70px;
  font-family: Arial, sans-serif
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  caret-color: black;

  &:focus {
    border-color: #9c9cfe;
    box-shadow: 1px 1px 2px #000000, 0 0 25px #9c9cfe, 0 0 5px #9c9cfe;
    outline: none;
    animation: ${blink} 1s step-end infinite;
  }
`;

const Button = styled.button`
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

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
`;

const Star = styled.span`
  font-size: 1.5rem;
  margin: 0 3px;
  color: ${props => props.filled ? '#E5B80B' : '#555'}; 
  transition: color 0.3s ease;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const HeartContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Heart = styled.span`
  font-size: 2rem;
  margin: 0 5px;
  color: ${props => props.filled ? 'red' : '#555'};
  transition: color 0.3s ease, transform 0.3s ease;
  ${props => props.filled && props.animate && css`
    animation: ${heartBeat} 0.6s ease infinite;
  `}
  transform-origin: center;
`;

const Timer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: ${props => props.expired ? '#ff0000' : '#9c9cfe'};
  animation: ${props => props.expired ? timerAnimation : 'none'} 1s infinite;
`;

const TranslationTask = ({ level, handleLevelCompletion, stars }) => {
  const [frenchText, setFrenchText] = useState('');
  const [aiTranslation, setAiTranslation] = useState('');
  const [userTranslation, setUserTranslation] = useState('');
  const [questionNumber, setQuestionNumber] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); 
  const [timerExpired, setTimerExpired] = useState(false);
  const [starsEarned, setStarsEarned] = useState(stars);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/generate_paragraph', {
        params: { level, user_id: 'user123' }
      });
      const data = response.data;

      if (data.level_completed) {
        setLevelCompleted(true);
        toast.success(data.message);
        return;
      }

      setFrenchText(data.french);
      setAiTranslation(data.english);
      setUserTranslation('');
      setHearts(data.hearts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [level]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimerExpired(true);
      setHearts(prevHearts => prevHearts - 1);
      if (hearts > 1) {
        toast.error('Time is up! You lost a heart. Try again!');
        setTimeLeft(180);
        fetchData();
      } else {
        toast.error('No hearts left! Redirecting to level selection.');
        setTimeout(() => {
          handleLevelCompletion(level, 0, starsEarned);
        }, 2000);
      }
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, hearts, handleLevelCompletion, level, starsEarned, fetchData]);

  const handleSubmit = async () => {
    if (hearts === 0) {
      toast.error('No hearts left! Please wait for them to recharge.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/verify', {
        user_translation: userTranslation.trim().toLowerCase(),
        correct_translation: aiTranslation.trim().toLowerCase(),
        user_id: 'user123',
        level
      });
      const data = response.data;

      if (data.is_correct) {
        setStarsEarned(prevStars => Math.min(prevStars + 1, 3));
        toast.success('Correct! Great job!');
        if (questionNumber < 2) {
          setQuestionNumber(prev => prev + 1);
          setTimeLeft(180);
          fetchData();
        } else {
          setLevelCompleted(true);
          toast.success(`Great job! You completed level ${level} successfully!`);
        }
      } else {
        setHearts(prevHearts => {
          const newHearts = prevHearts - 1;
          if (newHearts >= 0) {
            setAnimateHeart(true);
            setTimeout(() => setAnimateHeart(false), 600);
          }
          return newHearts;
        });
        toast.error('Incorrect. You lost a heart!');
      }
    } catch (error) {
      console.error('Error verifying translation:', error);
      toast.error('An error occurred while verifying the translation.');
    }
  };

  const handleNextLevel = () => {
    handleLevelCompletion(level, 10, starsEarned); 
    setLevelCompleted(false); 
    setQuestionNumber(0); 
    setTimeLeft(180); 
    setTimerExpired(false); 
  };


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <TaskContainer>
      <Title>Level {level}</Title>
      <Timer expired={timerExpired}>{formatTime(timeLeft)}</Timer>
      <HeartContainer>
        {[...Array(5)].map((_, index) => (
          <Heart key={index} filled={index < hearts} animate={animateHeart && index === hearts - 1}>
            ♥
          </Heart>
        ))}
      </HeartContainer>
      <Paragraph>
        <FrenchLabel><strong>French:</strong></FrenchLabel>
        <FrenchText>{frenchText}</FrenchText>
      </Paragraph>
      <TextArea
        value={userTranslation}
        onChange={(e) => setUserTranslation(e.target.value)}
        placeholder="Enter your translation or correction here..."
      />
      <Button onClick={handleSubmit}>Submit</Button>
      {levelCompleted && (
        <ButtonContainer>
          <Button onClick={handleNextLevel}>Next Level</Button>
        </ButtonContainer>
      )}
      <StarContainer>
        {[...Array(3)].map((_, index) => (
          <Star key={index} filled={index < starsEarned}>
            ★
          </Star>
        ))}
      </StarContainer>
      <ToastContainer />
    </TaskContainer>
  );
};

export default TranslationTask;
