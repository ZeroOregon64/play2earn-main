import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api/wordcount';

// Function to get paragraphs by level
export const fetchParagraphs = async (level) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paragraphs`, {
      params: { level: `level${level}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching paragraphs:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch paragraphs. Please check the server or network.');
  }
};

// Function to submit an answer
export const submitAnswer = async (id, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/submit-answer/${id}`, data);
    return response.data; // Ensure this matches the backend response
  } catch (error) {
    console.error('Error submitting answer:', error.response ? error.response.data : error.message);
    throw new Error('Failed to submit answer. Please check the server or network.');
  }
};
