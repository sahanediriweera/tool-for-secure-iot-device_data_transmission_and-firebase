// messageSender.js
const firebaseConfig = require('../firebase/firebaseconfig')
const { initializeApp } = require('firebase/app')
const { getDatabase, ref, push, set } = require('firebase/database');
const { encrypt } = require('./encryption');
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function sendMessage(userEmail, message,password) {
    // Replace periods in the email with underscores to create a valid path
    const sanitizedEmail = userEmail.replace('.', '_');
  
    const messagesRef = ref(database, `messages/${sanitizedEmail}`);
    const newMessageRef = push(messagesRef);
    const encryptedMessage = encrypt(message,password);
  
    set(newMessageRef, {
      message: encryptedMessage,
      timestamp: new Date().toISOString(),
    });
  }
module.exports = { sendMessage };
