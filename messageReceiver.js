// messageReceiver.js
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database'); // Updated imports
const { decrypt } = require('./encryption');

const firebaseConfig = {
  apiKey: "AIzaSyAkE9Gs-7V94g4qpbnlt89f7LZuIrJI3i8",
  authDomain: "securiot-68355.firebaseapp.com",
  databaseURL: 'https://securiot-68355-default-rtdb.asia-southeast1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function getMessages(userEmail) {
    const sanitizedEmail = userEmail.replace('.', '_');
    const messagesRef = ref(database, `messages/${sanitizedEmail}`);
  
    try {
      const snapshot = await get(messagesRef);
      const messages = [];
  
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const encryptedMessage = childSnapshot.val().message;
          const decryptedMessage = decrypt(encryptedMessage);
          messages.push(decryptedMessage);
        });
      }
  
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

module.exports = { getMessages };
