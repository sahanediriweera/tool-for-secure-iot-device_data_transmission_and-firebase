// messageSender.js
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, set } = require('firebase/database');
const { encrypt } = require('./encryption');

const firebaseConfig = {
  apiKey: "AIzaSyAkE9Gs-7V94g4qpbnlt89f7LZuIrJI3i8",
  authDomain: "securiot-68355.firebaseapp.com",
  databaseURL: 'https://securiot-68355-default-rtdb.asia-southeast1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function sendMessage(userEmail, message) {
    // Replace periods in the email with underscores to create a valid path
    const sanitizedEmail = userEmail.replace('.', '_');
  
    const messagesRef = ref(database, `messages/${sanitizedEmail}`);
    const newMessageRef = push(messagesRef);
    const encryptedMessage = encrypt(message);
  
    set(newMessageRef, {
      message: encryptedMessage,
      timestamp: new Date().toISOString(),
    });
  }
module.exports = { sendMessage };
