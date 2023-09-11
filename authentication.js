// authentication.js
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getDatabase, ref, child, get, set } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyAkE9Gs-7V94g4qpbnlt89f7LZuIrJI3i8",
  authDomain: "securiot-68355.firebaseapp.com",
  databaseURL: 'https://securiot-68355-default-rtdb.asia-southeast1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

async function isUserRegistered(email) {
  const usersRef = ref(database, 'users');
  const userSnapshot = await get(child(usersRef, email.replace('.', ',').toLowerCase()));
  return userSnapshot.exists();
}

async function validateCredentials(email, password) {
  if (!(await isUserRegistered(email))) {
    throw new Error('User not registered.');
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in successfully:', email);
  } catch (error) {
    throw new Error('Incorrect email or password.');
  }
}

async function registerUser(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered successfully:', email);

    // Save user data to the database (optional)
    const usersRef = ref(database, 'users');
    const sanitizedEmail = email.replace('.', ',').toLowerCase();
    await set(child(usersRef, sanitizedEmail), { email });
  } catch (error) {
    throw new Error('Error registering user:', error.message);
  }
}

async function loginUser(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully:', email);
    } catch (error) {
      throw new Error('Login error: Incorrect email or password.');
    }
  }

module.exports = { registerUser, validateCredentials, isUserRegistered , loginUser };
