import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Twitter, MessageCircle, Send } from 'lucide-react';

const ShareAchievement = ({ onClose }) => {
  const shareText = encodeURIComponent(`I just completed all levels in the Translation Challenge! Can you beat my score? Join now: http://www.play2earn.ai/`);

  const handleShare = (platform) => {
    let shareUrl;
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${shareText}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=[Website URL]&text=${shareText}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
          <Title>🎉 Congratulations!</Title>
          <Message>
            You've completed all levels in the Translation Challenge!
          </Message>
          <ShareOptions>
            <ShareText>Share your achievement:</ShareText>
            <ShareButtons>
              <ShareButton onClick={() => handleShare('twitter')} bgColor="#1DA1F2" aria-label="Share on Twitter">
                <Twitter size={20} /> Twitter
              </ShareButton>
              <ShareButton onClick={() => handleShare('whatsapp')} bgColor="#25D366" aria-label="Share on WhatsApp">
                <MessageCircle size={20} /> WhatsApp
              </ShareButton>
              <ShareButton onClick={() => handleShare('telegram')} bgColor="#0088cc" aria-label="Share on Telegram">
                <Send size={20} /> Telegram
              </ShareButton>
            </ShareButtons>
          </ShareOptions>
          <CloseButton onClick={onClose} aria-label="Close">Close</CloseButton>
      </Container>
    </Overlay>
  );
};

// Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
`;

const Container = styled(motion.div)`
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 24px;
  color: #444;
`;
const ShareText = styled.h3`
   margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
`;

const ShareButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const ShareOptions = styled.div`
  margin-bottom: 24px;
`;

const ShareButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ bgColor }) => bgColor};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
  }
`;

const CloseButton = styled.button`
  background: #9c9cfe;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: #6200ea;
    box-shadow: 1px 1px 2px #000000, 0 0 25px #9c9cfe, 0 0 5px #9c9cfe;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
  }
`;

export default ShareAchievement;
