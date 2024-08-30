// WelcomePage.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import backgroundImage from './B.png';

const WelcomePage = ({ onStart }) => {
    return (
        <WelcomeContainer>
            <Overlay />
            <WelcomeCard
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={onStart} // Trigger onStart when card is clicked
            >
                <Title
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Welcome to Translation Challenge!
                </Title>
                <Description>
                    Test your translation skills and earn rewards. 
                    <br />
                    Click to start the game.
                </Description>
            </WelcomeCard>
        </WelcomeContainer>
    );
};

// Styled Components
const WelcomeContainer = styled.div`
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

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
`;

const WelcomeCard = styled(motion.div)`
    position: relative;
    z-index: 2;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 90%;
    width: 1000px;
    cursor: pointer;
    
    @media (max-width: 1200px) {
        width: 80%;
        padding: 30px;
    }
    
    @media (max-width: 768px) {
        width: 90%;
        padding: 25px;
    }
    
    @media (max-width: 480px) {
        width: 95%;
        padding: 15px;
        border-radius: 15px;
    }
`;

const Title = styled(motion.h1)`
    color: #9c9cfe;
    text-shadow: 1px 1px 2px #000000, 0 0 25px #9c9cfe, 0 0 5px #9c9cfe;
    font-size: 3.5rem;
    margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
    
    @media (max-width: 1200px) {
        font-size: 3rem;
    }
    
    @media (max-width: 768px) {
        font-size: 2.5rem;
        margin-bottom: 15px;
    }
    
    @media (max-width: 480px) {
        font-size: 1.8rem;
        margin-bottom: 10px;
    }
`;

const Description = styled.p`
    color: #E5B80B;
    font-size: 1.5rem;
    margin-bottom: 40px;
    text-shadow: 1px 1px 2px #000000, 0 0 5px #E5B80B;
    font-family: 'Open Sans', sans-serif;
    white-space: normal;
    
    @media (max-width: 1200px) {
        font-size: 1.3rem;
        margin-bottom: 30px;
    }
    
    @media (max-width: 768px) {
        font-size: 1.2rem;
        margin-bottom: 20px;
    }
    
    @media (max-width: 480px) {
        font-size: 0.9rem;
        margin-bottom: 15px;
    }
`;

export default WelcomePage;
