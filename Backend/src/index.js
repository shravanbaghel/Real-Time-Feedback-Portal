
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const feedbackRoutes = require('../src/routes/feedbackRoutes');
const socketManager = require('../src/sockets/socketManager');
const feedbackController = require('../src/controllers/feedbackController'); // Import the feedbackController

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect("mongodb+srv://shravan:Onlypillu17@cluster0.kkeze6r.mongodb.net/myData?retryWrites=true&w=majority");

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  transports: ['websocket']
});

// Socket.io connection event
io.on('connection', (socket) => {
  socketManager(io, socket); 
});

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON in request bodies
app.use(express.json());

// Routes
app.use('/api', feedbackRoutes);

// This is for fetching all the current and old feedbacks
app.get('/get-feedbacks', feedbackController.getFeedbacks);

// Route for the root path
app.get('/', (req, res) => {
  res.send('Express Server is running.');
});

// Start the server
const port = 4000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

