/*
 * ============================================================================
 * File        : auth.ts
 * Description : Store authentication
 * ============================================================================
 * History
 * ============================================================================
 * Number | Date(YYYYMMDD) | Description
 * -------|----------------|----------------------------------------------------------------
 *      1 |   2026-03-20   | Initial version
 * 
 * ============================================================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '__ip_admin_token',
  USER_DATA: '__ip_admin_user',
  TIMESTAMP: '__ip_admin_timestamp'
};

// Token expiry time (24 hours)
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * Base64 encode (simple obfuscation, NOT encryption)
 */
function encode(data) {
  try {
    return btoa(data);
  } catch (error) {
    console.error('❌ Encode failed:', error);
    return null;
  }
}

/**
 * Base64 decode
 */
function decode(encodedData) {
  try {
    return atob(encodedData);
  } catch (error) {
    console.error('❌ Decode failed:', error);
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {

  const _token = ref(localStorage.getItem(STORAGE_KEYS.TOKEN) || null);
  const _userData = ref(localStorage.getItem(STORAGE_KEYS.USER_DATA) || null);
  const _timestamp = ref(localStorage.getItem(STORAGE_KEYS.TIMESTAMP) || null);

  const isAuthenticated = computed(() => {
    const token = getToken();
    const userData = getUserData();
    const expired = isExpired();

    const isAuth = !!token.value && !!userData.value && !expired.value;

    if (!isAuth && (token || userData)) {
      console.log('⚠️ Authentication invalid, clearing...');
      clearAuth();
    }
    return isAuth;
  })

  /**
   * Save authentication data
   * @param {string} tokenId - Token ID from server
   * @param {object} userData - User data object
   * @returns {boolean} - Success status
   */
  function setAuth(tokenId, userData) {
    if (!tokenId || !userData) {
      console.error('⚠️ Missing token or userData');
      return false;
    }

    try {
      const timestamp = Date.now();

      // Encode token ID (Base64 - simple obfuscation)
      const encodedToken = encode(tokenId);
      if (!encodedToken) {
        throw new Error('Token encoding failed');
      }

      // Encode user data
      const encodedUserData = encode(JSON.stringify(userData));
      if (!encodedUserData) {
        throw new Error('User data encoding failed');
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, encodedToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, encodedUserData);
      localStorage.setItem(STORAGE_KEYS.TIMESTAMP, timestamp.toString());

      // Save to memory
      _token.value = tokenId;
      _userData.value = userData;
      _timestamp.value = timestamp;
      console.log('✅ Auth saved successfully:');

      // For Debug
      // console.log('✅ Auth saved successfully:', {
      //   username: userData.username,
      //   timestamp: new Date(timestamp).toLocaleString(),
      //   tokenPreview: tokenId.substring(0, 15) + '...'
      // });

      // Log to localStorage for verification
      // console.log('📦 localStorage keys:', {
      //   token: localStorage.getItem(STORAGE_KEYS.TOKEN)?.substring(0, 20) + '...',
      //   userData: localStorage.getItem(STORAGE_KEYS.USER_DATA)?.substring(0, 20) + '...',
      //   timestamp: localStorage.getItem(STORAGE_KEYS.TIMESTAMP)
      // });

      return true;
    } catch (error) {
      console.error('❌ Failed to save auth:', error);
      return false;
    }
  }

  /**
   * Clear authentication data
   * @returns {boolean}
   */
  function clearAuth() {
    try {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);

      // Clear memory
      _token.value = null;
      _userData.value = null;
      _timestamp.value = null;

      console.log('🗑️ Auth cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear auth:', error);
      return false;
    }
  }
  

  /**
   * Refresh token timestamp (extend session)
   * @returns {boolean}
   */
  function refreshSession() {
    try {
      const token = getToken();
      const userData = getUserData();

      if (!token || !userData) {
        console.warn('⚠️ No auth data to refresh');
        return false;
      }

      // Update timestamp
      const newTimestamp = Date.now();
      localStorage.setItem(STORAGE_KEYS.TIMESTAMP, newTimestamp.toString());
      _timestamp.value = newTimestamp;

      console.log('🔄 Session refreshed');
      return true;
    } catch (error) {
      console.error('❌ Failed to refresh session:', error);
      return false;
    }
  }
  

  /**
   * Get time remaining until token expires
   * @returns {number} - Milliseconds remaining
   */
  function getTimeRemaining() {
    try {
      const timestamp = _timestamp || parseInt(localStorage.getItem(STORAGE_KEYS.TIMESTAMP));
      if (!timestamp) return 0;

      const elapsed = Date.now() - timestamp;
      const remaining = TOKEN_EXPIRY_MS - elapsed;

      return remaining > 0 ? remaining : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get authentication status summary
   * @returns {object}
   */
  function getAuthStatus() {
    const token = getToken();
    const userData = getUserData();
    const isAuth = isAuthenticated();
    const timeRemaining = getTimeRemaining();

    return {
      isAuthenticated: isAuth,
      username: userData?.username || null,
      tokenId: token ? `${token.substring(0, 10)}...` : null,
      timeRemaining,
      timeRemainingHours: (timeRemaining / (1000 * 60 * 60)).toFixed(2),
      expiresAt: _timestamp ? new Date(_timestamp + TOKEN_EXPIRY_MS).toLocaleString() : null,
      storage: {
        hasTokenInStorage: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
        hasUserDataInStorage: !!localStorage.getItem(STORAGE_KEYS.USER_DATA),
        hasTimestampInStorage: !!localStorage.getItem(STORAGE_KEYS.TIMESTAMP)
      }
    };
  }

  /**
   * Get token ID (decoded)
   * @returns {string|null}
   */
  function getToken() {
    // Return from memory if available
    if (_token) return _token;

    // Try to restore from localStorage
    try {
      const encodedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!encodedToken) return null;

      const decodedToken = decode(encodedToken);
      if (!decodedToken) return null;

      // Cache in memory
      _token.value = decodedToken;
      return decodedToken;
    } catch (error) {
      console.error('❌ Failed to get token:', error);
      return null;
    }
  }

  /**
   * Get user data (decoded)
   * @returns {object|null}
   */
  function getUserData() {
    // Return from memory if available
    if (_userData) return _userData;

    // Try to restore from localStorage
    try {
      const encodedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!encodedUserData) return null;

      const decodedUserData = decode(encodedUserData);
      if (!decodedUserData) return null;

      const userData = JSON.parse(decodedUserData);
      
      // Cache in memory
      _userData.value = userData;
      return userData;
    } catch (error) {
      console.error('❌ Failed to get user data:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   * @returns {boolean}
   */
  function isExpired() {
    try {
      const timestamp = _timestamp || parseInt(localStorage.getItem(STORAGE_KEYS.TIMESTAMP));
      if (!timestamp) return true;

      const elapsed = Date.now() - timestamp;
      const isExpired = elapsed > TOKEN_EXPIRY_MS;
      
      if (isExpired) {
        console.log('⏰ Token expired:', {
          elapsed: (elapsed / (1000 * 60 * 60)).toFixed(2) + ' hours',
          limit: (TOKEN_EXPIRY_MS / (1000 * 60 * 60)) + ' hours'
        });
      }
      
      return isExpired;
    } catch (error) {
      console.error('❌ Failed to check expiry:', error);
      return true;
    }
  }

  return {
    isAuthenticated,
    getToken,
    setAuth,
    clearAuth,
    refreshSession,
    getTimeRemaining,
    getAuthStatus
  }
})