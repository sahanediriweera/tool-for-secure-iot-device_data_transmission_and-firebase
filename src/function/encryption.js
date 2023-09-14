// encryption.js
const CryptoJS = require('crypto-js');
require('dotenv').config();


const secretKey = process.env.SECRETKEY;

function encrypt(message) {
  
  const encrypted = CryptoJS.AES.encrypt(message, secretKey).toString();
  return encrypted;
}

function decrypt(encryptedMessage) {
  const decrypted = CryptoJS.AES.decrypt(encryptedMessage, secretKey).toString(CryptoJS.enc.Utf8);
  return decrypted;
}

module.exports = { encrypt, decrypt };
