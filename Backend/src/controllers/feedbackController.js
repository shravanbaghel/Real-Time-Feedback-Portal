// feedbackController.js
const Feedback = require('../feedbackModel');

exports.submitFeedback = async (req, res) => {
  try {
    const { name, message } = req.body;

    const newFeedback = new Feedback({ name, message });
    await newFeedback.save();

    io.emit('feedback', { name: newFeedback.name, message: newFeedback.message });

    res.status(200).send('Feedback submitted successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
