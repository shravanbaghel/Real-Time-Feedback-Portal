// socketManager.js
const Feedback = require('../feedbackModel');

module.exports = (io, socket) => {
 
  console.log('A user connected');
  socket.emit('welcome', 'Welcome to the Real-Time Customer Feedback Portal!');

  socket.on('newFeedback', async (data) => {
    try {
      console.log('Received new feedback:', data);
      console.log('Attempting to save feedback to MongoDB...');

      const newFeedback = new Feedback({
        name: data.name,
        message: data.message
      });
      await newFeedback.save();

      io.emit('feedback', { name: newFeedback.name, message: newFeedback.message });
    } catch (error) {
      console.error('Error handling new feedback:', error);
    }
  });
};
