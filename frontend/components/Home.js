'use client'
import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css"
import io from "socket.io-client";

const Home = () => {

  // STATES
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);


  // useEffect to handle socket connection and initial data fetching

  useEffect(() => {

    // Establishing socket connection
    const socketConnection = io("http://localhost:4000", { transports: ["websocket"] });

    console.log(socketConnection);

    socketConnection.on('welcome', (message) => {
      console.log(message);
    });

    // Event listener for incoming 'feedback'
    socketConnection.on('feedback', (newFeedback) => {

      setFeedbackList(prevFeedbackList => [...prevFeedbackList, newFeedback]);
      console.log('Received feedback:', newFeedback);
    });

    setSocket(socketConnection);

    // Fetch existing feedbacks when the component mounts
    fetchFeedbacks();


    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Function to fetch existing feedbacks from the server
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:4000/get-feedbacks');
      const data = await response.json();
      console.log('Fetched feedbacks:', data);
      // Update feedbackList with data from the server using STATES
      setFeedbackList(data.feedbacks.map(feedback => ({ name: feedback.name, message: feedback.message })));
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  // Event handler for feedback input change
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Event handler for submitting feedback
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const submitFeedback = () => {
    // Check if socket exists and input fields are not empty
    if (socket && name.trim() !== "" && feedback.trim() !== "") {
      socket.emit('newFeedback', { name, message: feedback });

      // Clear the input fields
      setName("");
      setFeedback("");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Customer Feedback Portal</h1>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h2>Welcome to Our Feedback Portal</h2>
          <p>We value your opinions. Share your thoughts with us!</p>
          <div className={styles.feedbackForm}>
            <input
              className={styles.feedbackFormInput}
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
            />
            <input
              className={styles.feedbackFormInput}
              type="text"
              placeholder="Type your feedback here..."
              value={feedback}
              onChange={handleFeedbackChange}
            />
            <button className={styles.btn} onClick={submitFeedback}>
              Submit Feedback
            </button>
          </div>
        </section>
        <section className={styles.feedbackList}>
          {feedbackList.map((newFeedback, index) => (
            <div key={index} className={styles.feedbackItem}>
              <h4>{newFeedback.name}</h4>
              <p>{newFeedback.message}</p>
              {/* You can add a reply functionality here */}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
