const crypto = require('crypto');

// Gen random 256 bit (32 bytes) key
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);