/* ============================================
   MY JOURNEY — AUTH
   Local Authentication System
   ============================================ */

import { Utils } from './utils.js';

const AUTH_KEY = 'mj_auth_hash';
const SESSION_KEY = 'mj_session';

export const Auth = {
  /**
   * Check if this is the first time (no password set)
   */
  isFirstRun() {
    return !localStorage.getItem(AUTH_KEY);
  },

  /**
   * Register a new password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async register(password) {
    if (!password || password.length < 4) {
      throw new Error('Password minimal 4 karakter');
    }

    const hash = await Utils.hashPassword(password);
    localStorage.setItem(AUTH_KEY, hash);
    this._createSession();
    return true;
  },

  /**
   * Login with password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async login(password) {
    const storedHash = localStorage.getItem(AUTH_KEY);
    if (!storedHash) throw new Error('Belum ada akun. Silakan register.');

    const inputHash = await Utils.hashPassword(password);
    if (inputHash !== storedHash) {
      throw new Error('Password salah!');
    }

    this._createSession();
    return true;
  },

  /**
   * Check if user is currently logged in
   */
  isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === 'active';
  },

  /**
   * Logout — clear session
   */
  logout() {
    sessionStorage.removeItem(SESSION_KEY);
  },

  /**
   * Get password strength level
   * @param {string} password
   * @returns {'weak' | 'medium' | 'strong'}
   */
  getPasswordStrength(password) {
    if (!password) return '';
    if (password.length < 4) return 'weak';
    if (password.length < 8) return 'medium';

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const variety = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (password.length >= 8 && variety >= 3) return 'strong';
    if (password.length >= 6 && variety >= 2) return 'medium';
    return 'weak';
  },

  /**
   * Internal: create a session
   */
  _createSession() {
    sessionStorage.setItem(SESSION_KEY, 'active');
  },
};
