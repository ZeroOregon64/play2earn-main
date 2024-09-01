// TasksWeOffer.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Award, X, CheckCircle, Star } from "lucide-react";

const TaskCard = ({ task, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card
      className="h-full cursor-pointer overflow-hidden bg-white shadow-lg"
      onClick={() => onSelect(task)}
    >
      <div className="relative h-48">
        <img
          src={task.thumbnail}
          alt={task.category}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-sm font-bold">
          {task.reward} pts
        </div>
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2 text-blue-600">
          {task.category}
        </CardTitle>
        <p className="text-gray-600 mb-3">{task.description}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {task.duration}
          </span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= task.difficulty ? "text-yellow-400" : "text-gray-300"
                }`}
                fill={star <= task.difficulty ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const TaskModal = ({ task, onClose, onAccept }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl"
        >
          <div className="relative h-64">
            <img
              src={task.thumbnail}
              alt={task.category}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute top-4 right-4">
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {task.category}
              </h2>
              <div className="flex items-center text-white">
                <Clock className="w-5 h-5 mr-2" />
                <span className="mr-4">{task.duration}</span>
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                <span className="text-yellow-400">{task.reward} pts</span>
              </div>
            </div>
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-semibold mb-4">Task Instructions</h3>
            <p className="mb-6 text-lg">{task.instructions}</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="text-xl font-semibold mb-2">Task Benefits</h4>
              <ul className="list-disc list-inside">
                <li>Earn points quickly</li>
                <li>Improve your skills</li>
                <li>Contribute to meaningful projects</li>
              </ul>
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mr-3 h-5 w-5"
              />
              <label htmlFor="agree" className="text-lg">
                I agree to the task conditions
              </label>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => onAccept(task)}
                disabled={!agreed}
                variant="default"
                size="lg"
                className="w-full md:w-auto px-8 py-3 text-lg"
              >
                {agreed ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" /> Accept Task
                  </>
                ) : (
                  "Accept Task"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TasksWeOffer = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating API call to fetch tasks
    const fetchTasks = async () => {
      // In a real scenario, you would fetch this data from an API
      const tasksData = [
        {
          id: 1,
          category: "Audio Transcription",
          description: "Transcribe audio files accurately",
          thumbnail: "/assets/AUDIO Transcription.jpg ",
          duration: "10-15 mins",
          reward: 50,
          difficulty: 4,
          instructions:
            "Listen to the audio file and transcribe its content accurately. Pay attention to speaker changes and background noises.",
        },
        {
          id: 2,
          category: "Survey",
          description: "Complete surveys on various topics",
          thumbnail: "/assets/Survey.jpg",
          duration: "5-10 mins",
          reward: 30,
          difficulty: 5,
          instructions:
            "Answer all questions honestly. Your responses will be used for market research purposes.",
        },
        {
          id: 3,
          category: "Translation Challenge",
          description: "Translate phrases between languages",
          thumbnail: "/assets/Translation.jpg",
          duration: "15-20 mins",
          reward: 60,
          difficulty: 4,
          instructions:
            "Translate given phrases from one language to another. Accuracy and context are important.", // Updated instructions
        },
        {
          id: 4,
          category: "Wordify Task",
          description: "Create words from given letters",
          thumbnail: "/assets/Wordify.jpg",
          duration: "10 mins",
          reward: 40,
          difficulty: 3,
          instructions:
            "Create as many words as possible using the given set of letters. Longer words earn more points.",
        },
      ];
      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleAcceptTask = (task) => {
    if (task.category === "Survey") {
      navigate("/survey");
    } else if (task.category === "Wordify") {
      navigate("/wordify");
    } else {
      // Handle other task types here
      console.log(`Task accepted: ${task.category}`);
    }
    setSelectedTask(null);
  };

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-blue-800">
          Tasks We Offer
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={handleTaskSelect} />
          ))}
        </div>
      </div>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onAccept={handleAcceptTask}
        />
      )}
    </section>
  );
};

export default TasksWeOffer;
