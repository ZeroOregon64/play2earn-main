import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Shield,
  Video,
  Book,
  Mail,
  SquareCheckBig,
  SquareUser,
} from "lucide-react";

const HelpAndSupport = () => {
  const [activeSection, setActiveSection] = useState("faq");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    updates: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbylmsW65tMkxvCkK2UzV7R_8-MG5-lveLfUyQTLCZk8qVxBizUOiLsSPkBP0URgmCL_/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData).toString(),
        }
      );
      setFormSubmitted(true);
      setFormData({ name: "", email: "", message: "", updates: false });
    } catch (error) {
      console.error("There was a problem with form submission:", error);
    }
  };

  const sections = [
    { id: "faq", name: "FAQ", icon: MessageCircle },
    { id: "account", name: "Account", icon: SquareUser },
    { id: "tasks", name: "Tasks", icon: SquareCheckBig },
    { id: "support", name: "Support", icon: Shield },
    { id: "policies", name: "Policies", icon: Book },
    { id: "tutorials", name: "Tutorials", icon: Video },
    { id: "contact", name: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-blue-500 mb-12 text-center">
          Help & Support
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="md:col-span-1 space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full p-4 rounded-lg flex items-center space-x-4 transition duration-300 ${
                  activeSection === section.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white hover:bg-blue-50 text-blue-800"
                }`}
              >
                <section.icon className="w-6 h-6" />
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </motion.div>

          <motion.div
            className="md:col-span-2 bg-white rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {activeSection === "faq" && <FAQSection />}
            {activeSection === "account" && <AccountSection />}
            {activeSection === "tasks" && <TasksSection />}
            {activeSection === "support" && <SupportSection />}
            {activeSection === "policies" && <PoliciesSection />}
            {activeSection === "tutorials" && <TutorialsSection />}

            {activeSection === "contact" && (
              <ContactForm
                formData={formData}
                formSubmitted={formSubmitted}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            )}
          </motion.div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-blue-400 text-center text-sm md:text-base">
        <p>&copy; 2024 Play2Earn. All rights reserved.</p>
        <a className="text-blue-500" href="#">
          Report Bug
        </a>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Play2Earn.ai?",
      answer:
        "Play2Earn.ai is a platform where users can earn cryptocurrency tokens by completing tasks that help train AI models. Our mission is to democratize AI development by making it accessible and rewarding for everyone.",
    },
    {
      question: "How does Play2Earn.ai work?",
      answer:
        "Users register on the platform, complete various tasks, and earn cryptocurrency tokens as rewards. These tasks contribute to the training and improvement of AI models.",
    },
    {
      question: "Who can join Play2Earn.ai?",
      answer:
        "Anyone can join Play2Earn.ai. We welcome users from all backgrounds who are interested in contributing to AI development and earning rewards.",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Frequently Asked Questions
      </h2>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

const AccountSection = () => {
  const accountFaqs = [
    {
      question: "How do I create an account?",
      answer:
        "Click on the 'Register' button on the home page, fill out the registration form with your username, email, and password, and submit the form. You will receive a confirmation email to activate your account.",
    },
    {
      question: "How do I log in to my account?",
      answer:
        "Click on the 'Login' button, enter your registered email and password, and click 'Submit' to access your account.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Click on the 'Forgot Password' link on the login page, enter your registered email, and follow the instructions in the email to reset your password.",
    },
    {
      question: "How do I update my profile information",
      answer:
        "Log in to your account, navigate to the Profile page, and update your information as needed. Click Save to apply the changes.",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Account and Registration
      </h2>
      {accountFaqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

const TasksSection = () => {
  const tasksFaqs = [
    {
      question: "What types of tasks are available on Play2Earn.ai?",
      answer:
        "We offer various tasks, including surveys, data duplication detection, CAPTCHA completion, and AI model training feedback.",
    },
    {
      question: "How do I find and complete tasks?",
      answer:
        "Log in to your account, go to the 'Tasks' page, browse the list of available tasks, and click on a task to view its details. Follow the instructions to complete and submit the task.",
    },
    {
      question: "How are rewards calculated?",
      answer:
        "Rewards are based on the complexity and difficulty of the task. Each task has a predefined reward amount, which you can view on the task details page.",
    },
    {
      question: "How do I withdraw my earnings?",
      answer:
        "Go to the Rewards page, check your available balance, and click on the Withdraw button. Follow the instructions to transfer your earnings to your cryptocurrency wallet.",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Tasks and Rewards
      </h2>
      {tasksFaqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

const SupportSection = () => {
  const supportFaqs = [
    {
      question: "What should I do if I encounter a technical issue?",
      answer:
        "If you encounter a technical issue, please contact our support team by clicking on the 'Contact Us' tab and filling out the form. Provide as much detail as possible about the issue.",
    },
    {
      question: "How long does it take to get a response from support?",
      answer:
        "Our support team strives to respond to all inquiries within 24 hours. However, response times may vary depending on the volume of requests.",
    },
    {
      question: "Are there any common solutions to frequent issues?",
      answer:
        "Yes, we have a list of common solutions to frequent issues in our Help Center. Please check the Help Center before contacting support.",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Technical Support
      </h2>
      {supportFaqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

const PoliciesSection = () => {
  const policiesFaqs = [
    {
      question: "What are the rules for using Play2Earn.ai?",
      answer:
        "Users must adhere to our terms of service and community guidelines, which prohibit fraudulent activities, spamming, and any form of misconduct. Violating these rules can result in account suspension or termination.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can contact our customer support team by emailing support@play2earn.ai or by filling out the contact form on the 'Support' page.",
    },
    {
      question: "Can I refer friends to Play2Earn.ai?",
      answer:
        "Yes, you can refer friends to join Play2Earn.ai. Share your referral link, and when your friends sign up using your link, both you and your friends can earn additional rewards.",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Platform Policies
      </h2>
      {policiesFaqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

const TutorialsSection = () => {
  const tutorials = [
    {
      title: "Getting Started with Play2Earn.ai",
      duration: "5 min",
      link: "https://www.youtube.com/watch?v=SUecegkK5GM",
    },
    {
      title: "Completing Your First Task",
      duration: "8 min",
      link: "https://www.youtube.com/watch?v=dkGaIVfNYRw",
    },
    {
      title: "Maximizing Your Earnings",
      duration: "12 min",
      link: "https://www.youtube.com/watch?v=ecaHSVb_6jM",
    },
    {
      title: "Understanding AI Training Tasks",
      duration: "15 min",
      link: "https://www.youtube.com/watch?v=4zJ3cvAjRhA",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Video Tutorials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tutorials.map((tutorial, index) => (
          <div
            key={index}
            className="bg-white border border-blue-300 p-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => window.open(tutorial.link, "_blank")}
          >
            <h3 className="font-semibold text-blue-700">{tutorial.title}</h3>
            <p className="text-blue-600">{tutorial.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactForm = ({
  formData,
  formSubmitted,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Contact Us</h2>
      {formSubmitted ? (
        <div
          className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg"
          role="alert"
        >
          <p className="font-bold">Thank you for contacting us!</p>
          <p>
            Your message has been sent successfully. We will get back to you
            soon.
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="updates"
              name="updates"
              checked={formData.updates}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="updates"
              className="ml-2 block text-sm text-gray-900"
            >
              Send me updates about Play2Earn.ai
            </label>
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-gray-200 pb-4"
      initial={false}
      animate={{ height: isOpen ? "auto" : "2.5rem" }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-blue-700">{question}</span>
        <motion.span
          className="text-blue-500"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </button>
      {isOpen && (
        <motion.p
          className="mt-2 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {answer}
        </motion.p>
      )}
    </motion.div>
  );
};

export default HelpAndSupport;
