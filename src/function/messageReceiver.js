// messageReceiver.js
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database'); // Updated imports
const { decrypt } = require('./encryption');
const firebaseConfig = require('../firebase/firebaseconfig');

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function getMessages(userEmail,password) {
    const sanitizedEmail = userEmail.replace('.', '_');
    const messagesRef = ref(database, `messages/${sanitizedEmail}`);
  
    try {
      const snapshot = await get(messagesRef);
      const messages = [];
  
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const encryptedMessage = childSnapshot.val().message;
          const decryptedMessage = decrypt(encryptedMessage,password);
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
