const { sendMessage } = require('../src/function/messageSender');
const { registerUser, loginUser } = require('../src/auth/authentication');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function loginOrRegister() {
  try {
    rl.question('Enter your email: ', async (email) => {
      rl.question('Enter your password: ', async (password) => {
        try {
          // Attempt to log in the user
          await loginUser(email, password);

          console.log('Logged in successfully.');

          // Start sending messages loop
          sendMessagesLoop(email);
        } catch (loginError) {
          console.error('Login error:', loginError.message);
          rl.question('User not registered. Do you want to register? (yes/no): ', async (response) => {
            if (response.toLowerCase() === 'yes') {
              try {
                // Register the user if they want to
                await registerUser(email, password);
                console.log('Registered and logged in successfully.');

                // Start sending messages loop
                sendMessagesLoop(email,password);
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

async function sendMessagesLoop(email,password) {
    while (true) {
      rl.setPrompt('Enter the message to send (or type "exit" to quit): ');
      rl.prompt();
  
      await new Promise((resolve) => {
        rl.once('line', async (message) => {
          if (message.toLowerCase() === 'exit') {
            console.log('Exiting the message sending loop.');
            rl.close();
          } else {
            // Send the message
            sendMessage(email, message,password);
            console.log('Message sent successfully.');
          }
          // Add a delay to avoid flooding the input with messages
          setTimeout(resolve, 1000);
        });
      });
    }
  }

loginOrRegister();
