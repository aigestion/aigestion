'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.loadPremiumCredentials = loadPremiumCredentials;
exports.validateCredential = validateCredential;
exports.loadGooglePasswordManagerCredentials = loadGooglePasswordManagerCredentials;
// premium management module
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const credentialsPath = path_1.default.resolve(__dirname, 'premium_credentials.json');
function loadPremiumCredentials() {
  const raw = fs_1.default.readFileSync(credentialsPath, { encoding: 'utf-8' });
  return JSON.parse(raw);
}
function validateCredential(email, password) {
  const creds = loadPremiumCredentials();
  return creds.some(c => c.email === email && c.password === password);
}
// Google Password Manager credentials
const googleCredentialsPath = path_1.default.resolve(__dirname, 'google_password_manager.json');
function loadGooglePasswordManagerCredentials() {
  const raw = fs_1.default.readFileSync(googleCredentialsPath, { encoding: 'utf-8' });
  return JSON.parse(raw);
}
