// InstructionPopup.jsx
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const InstructionPopup = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <PopupOverlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PopupContent
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="instructions-title"
                    >
                        <CloseButton onClick={onClose} aria-label="Close instructions">
                            <IoClose />
                        </CloseButton>
                        <h2 id="instructions-title">Game Instructions</h2>
                        <p>
                            Welcome to the <strong>Translation To Earn</strong> game! Test your translation skills and earn rewards as you progress through challenging levels. Here's how it works:
                        </p>
                        <ul>
                            <li>Select a level from the level selection screen.</li>
                            <li>You will be given a French sentence to translate into English.</li>
                            <li>Type your translation in the provided text box and submit it for verification.</li>
                            <li>You have 2 minutes to submit your translation before the time runs out.</li>
                            <li>Each correct translation earns you a star and tokens based on difficulty.</li>
                            <li>If your translation is incorrect, you will lose a heart. You start with 5 hearts.</li>
                            <li>Complete all 4 questions in a level to progress to the next one.</li>
                            <li>Once a level is completed, you cannot return to it.</li>
                            <li>The game ends when you complete all 10 levels or lose all your hearts.</li>
                        </ul>
                        <p>
                            Remember, the difficulty increases as you progress, and so do the rewards! Stay focused, manage your time, and aim for perfect translations. Good luck!
                        </p>
                        <p><strong>Tip:</strong> Watch the timer and try to submit before it runs out!</p>
                    </PopupContent>
                </PopupOverlay>
            )}
        </AnimatePresence>
    );
};

const PopupOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6); 
    z-index: 1500; 
    padding: 20px;
    box-sizing: border-box;
`;

const PopupContent = styled(motion.div)`
    background: white;
    padding: clamp(15px, 5vw, 30px);
    border-radius: 15px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); 
    position: relative;
    text-align: left;

    h2 {
        margin-top: 0;
        color: #6200ea;
        font-size: clamp(1.2rem, 4vw, 2rem);
        text-align: center;
    }

    p, ul li {
        margin-bottom: 1.2rem;
        line-height: 1.6;
        color: #333;
        font-size: clamp(0.8rem, 2vw, 1rem);
    }

    ul {
        list-style: disc;
        padding-left: 20px;
        margin-bottom: 1.5rem;

        li {
            margin-bottom: 0.8rem;
        }
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: #333;
    cursor: pointer;
    transition: color 0.3s ease;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover, &:focus {
        color: #ff0000;
        outline: none;
    }
`;

export default InstructionPopup;
