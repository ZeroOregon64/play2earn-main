import React, { useState, useEffect } from 'react';
import './AudioTranscript.css';
import AudioPlayer from './AudioPlayer';
import Feedback from './Feedback';
import spellingVariations from './spellingVariations';
import { FaHeart, FaGem, FaArrowLeft, FaTimes, FaLock, FaUnlock, FaStar, FaTwitter, FaWhatsapp, FaTelegram} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet';

import 'react-toastify/dist/ReactToastify.css';
import audio1 from './audio1.wav';
import audio2 from './audio2.wav';
import audio3 from './audio3.wav';
import audio4 from './audio4.wav';
import audio5 from './audio5.wav';
import audio6 from './audio6.wav';
import audio7 from './audio7.wav';
import audio8 from './audio8.wav';
import audio9 from './audio9.wav';
import audio10 from './audio10.wav';

const tasks = [
  {
    audioClip: audio1,
    correctTranscription: "The stale smell of old beer lingers, it takes heat to bring out the odor. A cold dip restores health and zest. A salt pickle tastes fine with ham. Tacos al Pastor are my favorite. A zestful food is the hot crossed bun.",
    difficulty: "easy"
  },
  {
    audioClip: audio2,
    correctTranscription: "Hi, Jeremy. I want to call back. Glad we could connect more than anything. I want to make sure we find time on the calendar for a short demo. I think if you and the other stakeholders see the product in action, they'll be able to understand why we're able to make such grandiose statements. If we're not able to improve the efficiency of your sales force by at least 10% in the first month, we have a full money back guarantee.",
    difficulty: "easy"
  },
  {
    audioClip: audio3,
    correctTranscription: "Is this a good time to talk? I know we connected briefly last week and you'd mentioned needing to check with your wife since this is an investment. Did you two have a chance to discuss? There's no rush on the decision. But the Labor Day promo we have is almost over. So if you want to take full advantage of the savings tomorrow is the last day to sign up. Like I said before, registration is free. The only fees you pay happen once you've purchased an equity or annuity on the marketplace.",
    difficulty: "easy"
  },
  {
    audioClip: audio4,
    correctTranscription: "I'm returning a call from David. Hi, David. In your message you mentioned not being able to log into the platform.  We have a forgot password link on the sign up page, but I can also reset your password, which would you prefer? Great. So you'll receive an email in the next few seconds with instructions. If you don't see it, check your spam folder. I also noticed you have a pending invoice but an account credit that you haven't used. Would you like me to apply your credit to the invoice that will lower your bill by $15? Great.  I'll do that now.",
    difficulty: "medium"
  },
  {
    audioClip: audio5,
    correctTranscription: "Hi, this is James calling from the Boston Consulting Group. Right now, we have a promotion on our executive consulting services. Is this an ok time to talk? I'd like to discuss how we can help you streamline your team's business processes from the ground up. Basically, we specialize in accounting, management consulting, private equity finance advisory. And we recently built an award winning team to focus just on digital product development, which I think is probably the most applicable to what you guys do. Right.",
    difficulty: "medium"
  },
  {
    audioClip:  audio6,
    correctTranscription: "Hey. Yeah, so you asked about discounts. We don't really offer any to our monthly members, but we do have a 5% discount off the annual package. Considering you've been a member for nine months. It might make sense to switch over to the annual package. We can pro rate the previous nine months. Is that something you'd be interested in? Happy to make that change for you.",
    difficulty: "medium"
  },
  {
    audioClip:  audio7,
    correctTranscription: "To be clear, the functionality you're describing is something we've had suggested to us. And I believe it's in development, we're very focused on building the best product in the space. But we still have to prioritize new features to reiterate. You're looking for the ability to highlight multiple accounts and see the top metrics for all highlighted accounts. Is that right?",
    difficulty: "medium"
  },
  {
    audioClip:  audio8,
    correctTranscription: "Your hands lie open in the long fresh grass. The finger points look through like rosy blooms. Your eyes smile, peace. The pasture gleams and gloom. Neath, billowing skies that scatter and amass all round our nest. Far as the eye can pass our golden king cup fields with silver edge where the cow parsley skirts the hawthorn hedge tis visible silence still is the hourglass. Your hands lie open in the long fresh grass. The finger points look through like rosy blooms. Your eyes smile, peace. The pasture gleams and gloom. Neath billowing skies that scatter and amass all round our nest. Far as the eye can pass are golden kingcup fields with silver edge where the cow parsley skirts the hawthorn hedge tis visible silence. Still as the hourglass.",
    difficulty: "hard"
  },
  {
    audioClip:  audio9,
    correctTranscription: "How many people are there in your family? There are five people in my family. My father, mother, brother, sister and me. Does your family live in a house or an apartment? We live in a house in the countryside? What does your father do? My father is a doctor. He works at the local hospital. How old is your mother? She is 40 years old. One year younger than my father. Do you have any siblings? What's his or her name? Yes, I do. I have one elder brother, David and one younger sister, Mary. Are you the oldest among your brothers and sisters? No, I'm not. I'm the second child in my family. What is your mother? Father like? My father likes playing football and my mother likes cooking. Do your parents let you stay out late? Of course not. They always ask me to get home before 10 p.m. each night. Do you stay with your parents right now? No, but I used to. Does your family usually have dinner together? Yes, we do. My mom always prepares delicious meals for us.",
    difficulty: "hard"
  },
  {
    audioClip:  audio10,
    correctTranscription: "What's your favorite music band? I'm a big fan of one direction. There are five singers in the band. Is it famous around the world? Yes, it is. The band is well known around the world. Almost all teenagers love them. What's their taste of music? They sing pop music. Their most famous song may be. What makes you beautiful? Are they good at dancing? Yes, I think so. I fall in love with their every step. Have you ever seen them in real life? Nope. I just watch them on media. I wish I will see them one day. How often do you come to their show? I watch videos almost every day listening to their songs. Helps me chill out. Can you sing their songs? Yes. But only one song. I just keep singing it over and over again every day. Do your friends like them? Of course, we usually watch their performances and discuss it together. Do they have anti fans? Yes. Every famous singer has anti fans.",
    difficulty: "hard"
  }
];

const App = () => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);
  const [points, setPoints] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setEndGame] = useState(false);
  const [levelSelectVisible, setLevelSelectVisible] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1); // Track the current level

  const normalizeText = (text) => {
    let normalizedText = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
    Object.keys(spellingVariations).forEach(ukSpelling => {
      const usSpelling = spellingVariations[ukSpelling];
      const regex = new RegExp(ukSpelling, 'g');
      normalizedText = normalizedText.replace(regex, usSpelling);
    });
    return normalizedText;
  };

  const checkTranscription = () => {
    const currentTask = tasks[currentTaskIndex];
    if (normalizeText(transcription) === normalizeText(currentTask.correctTranscription)) {
      setIsError(false);
      setPoints(points + 10);
      setTranscription("");
      setLives(Math.min(lives + 1, 3)); // Limit lives to a maximum of 3
      toast.success("Great job! You got it right!", { autoClose: 3000 });

      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
        setCurrentLevel(currentLevel + 1); // Move to the next level
      } else {
        toast.success("Congratulations! You've completed all levels!", { autoClose: 3000 });
        setGameStarted(false);
        setEndGame(true);
      }
    } else {
      setIsError(true);
      setLives(lives - 1);
      toast.error("Oops! That's not quite right. Try again!", { autoClose: 3000 });

      if (lives - 1 === 0) {
        setFeedback("You've lost all your lives! Try again tomorrow.");
      }
    }
  };

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < lives; i++) {
      hearts.push(<FaHeart key={i} className="heart full" />);
    }
    for (let i = lives; i < 3; i++) {
      hearts.push(<FaHeart key={i} className="heart empty" />);
    }
    return hearts;
  };

  const handleLevelSelect = (index) => {
    setCurrentTaskIndex(index);
    setGameStarted(true);
    setLevelSelectVisible(false);
  };

  const renderLevelsPage = () => {
    const levels = [];
    for (let i = 1; i <= tasks.length; i++) {
      const isLocked = i > currentLevel;
      const isCompleted = i < currentLevel;
      const isCurrentLevel = i === currentLevel;
      
      levels.push(
        
        <button
          key={i}
          className={`level-button ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${!isLocked && !isCompleted ? 'current' : ''}`}
          onClick={() => !isLocked && handleLevelSelect(i - 1)}
          disabled={isLocked || isCompleted} 
          
        >
          {isLocked || isCompleted ? (
            <FaLock className="icon" size={10}  />
          ) : (
            <FaUnlock className="icon" size={10} />
          )}
          {(!isLocked || isCompleted) && <span className="level-number">{i}</span>}
        </button>
        
      );
    }
    return (
      <div className="levels-page">
        <header className="app-header">
          <h1>Select a Level</h1>
        </header>
        <div className="level-buttons-container">
          {levels}
        </div>
      </div>
    );
  };
  const handleShare = (platform) => {
    const shareText = encodeURIComponent(
      `I just completed all levels in the Audio Transcription task! Join now: [http://www.play2earn.ai/]`
    );
    let shareUrl;
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${shareText}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=[Website URL]&text=${shareText}`;
        break;
      default:
        shareUrl = null;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };
  
  return (
    
    <div className='audio-transcription-game'>
      <Helmet>
      <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet"/>
      </Helmet>
    <div className={`app ${gameStarted || levelSelectVisible ? "expanded" : "initial"}`}>
      {!gameStarted && !levelSelectVisible && !gameEnded ? (
        <div className="start-page">
          <h1 className="title-head">Audio Transcription Game</h1>
          <hr />
          <button className="start-button" onClick={() => setLevelSelectVisible(true)}>Start</button>
        </div>
      ) : levelSelectVisible ? (
        renderLevelsPage() 
      ) : gameEnded ? (
        <>
          <div>
            <button className="exit-button" onClick={() => setLevelSelectVisible(true)}>
              <FaArrowLeft />
            </button>
            <h2 className='end-header'>Game Completed!</h2>
            <FaStar size={50} color='orange'/><FaStar size={100} color='orange'/><FaStar size={50} color='orange'/>
            <p className='end-para'>You completed all the levels </p>
            <div>
              <h2>Your total points: {points}</h2>
            </div>
            <div className="share-achievement">
              <h3>Share your achievement:</h3>
              <div className="share-buttons">
                <button onClick={() => handleShare("twitter")}>
                  <FaTwitter /> Twitter
                </button>
                <button onClick={() => handleShare("whatsapp")}>
                  <FaWhatsapp /> WhatsApp
                </button>
                <button onClick={() => handleShare("telegram")}>
                  <FaTelegram /> Telegram
                </button>
              </div>
            </div>
            
            
          </div>
        </>
      ): (
        <>
          <div className="top-buttons">
            <button className="exit-button" onClick={() => setLevelSelectVisible(true)}>
              <FaArrowLeft />  Level Select
            </button>
            <button className="exit-button" onClick={() => setGameStarted(false)}>
              <FaTimes />  Exit
            </button>
          </div>
          <h1>{gameStarted ? `Level ${currentTaskIndex + 1}` : 'Audio Transcription Task'}</h1>
          <hr />
          {lives > 0 ? (
            <>
              <AudioPlayer src={tasks[currentTaskIndex].audioClip} />
              <textarea value={transcription} onChange={(e) => setTranscription(e.target.value)} />
              <button className="submit-button" onClick={checkTranscription}>Submit</button>
            </>
          ) : (
            <p>{feedback}</p>
          )}
          <Feedback message={feedback} isError={isError} />
          <div className="point-lives">
            <div className="points">
             <FaGem /> Points: {points}
            </div>
            <div className="lives">
              <span>Lives: </span>
              {renderHearts()}
            </div>
          </div>

        </>
      )}
      <ToastContainer />
    </div>
    </div>
  );
};

export default App;
