const CryptoJs = require('crypto-js')

// Encrypt
function encrypt (text, secretKey) {
  const ciphertext = CryptoJs.AES.encrypt(text, secretKey).toString()
  return ciphertext
}

// Decrypt
function decrypt (ciphertext, secretKey) {
  const bytes = CryptoJs.AES.decrypt(ciphertext, secretKey)
  const originalText = bytes.toString(CryptoJs.enc.Utf8)
  return originalText
}

// to be implemented in the future
module.exports = {
  encrypt,
  decrypt
}
