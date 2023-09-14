// Load environment variables
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './../../.env') })

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
};

// Export the firebaseConfig object
module.exports = firebaseConfig;
