// GameOver.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import confetti from 'canvas-confetti';

const GameOver = ({ totalTokens }) => {
    useEffect(() => {
        const duration = 5 * 1000; 
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }, []);

    return (
        <GameOverContainer>
            <CelebrationText>🎉 Congratulations! 🎉</CelebrationText>
            <Title>Translation Challenge Completed!</Title>
            <Message>You've mastered all levels of the Translation Challenge.</Message>
            <PointsMessage>Total Tokens Earned: {totalTokens}</PointsMessage>
            <FooterMessage>Thanks for playing and honing your skills! 🎯</FooterMessage>
        </GameOverContainer>
    );
};

// Styled Components
const GameOverContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  animation: fadeIn 2s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CelebrationText = styled.h2`
  font-size: 2.5rem;
  color: #ff9800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
`;

const Message = styled.p`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
`;

const PointsMessage = styled.p`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
`;

const FooterMessage = styled.p`
  font-size: 1.2rem;
  color: #fff;
  margin-top: 2rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

export default GameOver;
