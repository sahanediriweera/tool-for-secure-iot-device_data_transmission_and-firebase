const { sendMessage } = require('./messageSender');
const { registerUser, loginUser } = require('./authentication');
const readline = require('readline');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onChildAdded } = require('firebase/database');
const { decrypt } = require('./encryption');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const firebaseConfig = {
  apiKey: "AIzaSyAkE9Gs-7V94g4qpbnlt89f7LZuIrJI3i8",
  authDomain: "securiot-68355.firebaseapp.com",
  databaseURL: 'https://securiot-68355-default-rtdb.asia-southeast1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function loginOrRegister() {
  try {
    rl.question('Enter your email: ', async (email) => {
      rl.question('Enter your password: ', async (password) => {
        try {
          // Attempt to log in the user
          await loginUser(email, password);

          console.log('Logged in successfully.');

          // Start retrieving and decrypting messages loop
          retrieveAndDecryptMessages(email);
        } catch (loginError) {
          console.error('Login error:', loginError.message);
          rl.question('User not registered. Do you want to register? (yes/no): ', async (response) => {
            if (response.toLowerCase() === 'yes') {
              try {
                // Register the user if they want to
                await registerUser(email, password);
                console.log('Registered and logged in successfully.');

                // Start retrieving and decrypting messages loop
                retrieveAndDecryptMessages(email);
              } catch (registrationError) {
                console.error('Registration error:', registrationError.message);
                rl.close();
              }
            } else {
              console.log('Exiting the application.');
              rl.close();
            }
          });
        }
      });
    });
  } catch (error) {
    console.error('An error occurred:', error);
    rl.close();
  }
}

function retrieveAndDecryptMessages(email) {
  const messagesRef = ref(database, 'messages/' + email.replace('.', '_'));

  onChildAdded(messagesRef, (snapshot) => {
    const encryptedMessage = snapshot.val().message;
    const decryptedMessage = decrypt(encryptedMessage);
    console.log('Decrypted Message:', decryptedMessage);
  });
}

loginOrRegister();
