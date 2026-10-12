// Encrypts an HTML fragment into the {salt,iter,iv,ct} shape gz.js decrypts
// client-side with Web Crypto (PBKDF2-SHA256 -> AES-256-GCM).
// Usage: node encrypt.js <input.html> <output.json> <password>
const fs = require('fs');
const crypto = require('crypto');

const [, , inputPath, outputPath, password] = process.argv;
if (!inputPath || !outputPath || !password) {
  console.error('Usage: node encrypt.js <input.html> <output.json> <password>');
  process.exit(1);
}

const ITER = 250000;
const plaintext = fs.readFileSync(inputPath, 'utf8');

const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(password, salt, ITER, 32, 'sha256');

const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();
// Web Crypto's AES-GCM decrypt expects ciphertext with the tag appended.
const ct = Buffer.concat([encrypted, tag]);

const payload = {
  salt: salt.toString('base64'),
  iter: ITER,
  iv: iv.toString('base64'),
  ct: ct.toString('base64'),
};

fs.writeFileSync(outputPath, JSON.stringify(payload));
console.log('Wrote', outputPath, '(', ct.length, 'bytes ciphertext )');
