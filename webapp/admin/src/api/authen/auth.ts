/**
 * Simple Authentication Store (No Encryption)
 * For testing without CryptoJS dependency
 */

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

/**
 * Authentication Store
 */
export const authStore = {
  // In-memory state
  _token: null,
  _userData: null,
  _timestamp: null,

  /**
   * Save authentication data
   * @param {string} tokenId - Token ID from server
   * @param {object} userData - User data object
   * @returns {boolean} - Success status
   */
  saveAuth(tokenId, userData) {
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
      this._token = tokenId;
      this._userData = userData;
      this._timestamp = timestamp;

      console.log('✅ Auth saved successfully:', {
        username: userData.username,
        timestamp: new Date(timestamp).toLocaleString(),
        tokenPreview: tokenId.substring(0, 15) + '...'
      });

      // Log to localStorage for verification
      console.log('📦 localStorage keys:', {
        token: localStorage.getItem(STORAGE_KEYS.TOKEN)?.substring(0, 20) + '...',
        userData: localStorage.getItem(STORAGE_KEYS.USER_DATA)?.substring(0, 20) + '...',
        timestamp: localStorage.getItem(STORAGE_KEYS.TIMESTAMP)
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to save auth:', error);
      return false;
    }
  },

  /**
   * Get token ID (decoded)
   * @returns {string|null}
   */
  getToken() {
    // Return from memory if available
    if (this._token) return this._token;

    // Try to restore from localStorage
    try {
      const encodedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!encodedToken) return null;

      const decodedToken = decode(encodedToken);
      if (!decodedToken) return null;

      // Cache in memory
      this._token = decodedToken;
      return decodedToken;
    } catch (error) {
      console.error('❌ Failed to get token:', error);
      return null;
    }
  },

  /**
   * Get user data (decoded)
   * @returns {object|null}
   */
  getUserData() {
    // Return from memory if available
    if (this._userData) return this._userData;

    // Try to restore from localStorage
    try {
      const encodedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!encodedUserData) return null;

      const decodedUserData = decode(encodedUserData);
      if (!decodedUserData) return null;

      const userData = JSON.parse(decodedUserData);
      
      // Cache in memory
      this._userData = userData;
      return userData;
    } catch (error) {
      console.error('❌ Failed to get user data:', error);
      return null;
    }
  },

  /**
   * Check if token is expired
   * @returns {boolean}
   */
  isExpired() {
    try {
      const timestamp = this._timestamp || parseInt(localStorage.getItem(STORAGE_KEYS.TIMESTAMP));
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
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken();
    const userData = this.getUserData();
    const expired = this.isExpired();

    const isAuth = !!token && !!userData && !expired;

    console.log('🔐 Auth check:', {
      hasToken: !!token,
      hasUserData: !!userData,
      expired,
      isAuthenticated: isAuth
    });

    if (!isAuth && (token || userData)) {
      console.log('⚠️ Authentication invalid, clearing...');
      this.clearAuth();
    }

    return isAuth;
  },

  /**
   * Clear authentication data
   * @returns {boolean}
   */
  clearAuth() {
    try {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);

      // Clear memory
      this._token = null;
      this._userData = null;
      this._timestamp = null;

      console.log('🗑️ Auth cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear auth:', error);
      return false;
    }
  },

  /**
   * Refresh token timestamp (extend session)
   * @returns {boolean}
   */
  refreshSession() {
    try {
      const token = this.getToken();
      const userData = this.getUserData();

      if (!token || !userData) {
        console.warn('⚠️ No auth data to refresh');
        return false;
      }

      // Update timestamp
      const newTimestamp = Date.now();
      localStorage.setItem(STORAGE_KEYS.TIMESTAMP, newTimestamp.toString());
      this._timestamp = newTimestamp;

      console.log('🔄 Session refreshed');
      return true;
    } catch (error) {
      console.error('❌ Failed to refresh session:', error);
      return false;
    }
  },

  /**
   * Get time remaining until token expires
   * @returns {number} - Milliseconds remaining
   */
  getTimeRemaining() {
    try {
      const timestamp = this._timestamp || parseInt(localStorage.getItem(STORAGE_KEYS.TIMESTAMP));
      if (!timestamp) return 0;

      const elapsed = Date.now() - timestamp;
      const remaining = TOKEN_EXPIRY_MS - elapsed;

      return remaining > 0 ? remaining : 0;
    } catch (error) {
      return 0;
    }
  },

  /**
   * Get authentication status summary
   * @returns {object}
   */
  getAuthStatus() {
    const token = this.getToken();
    const userData = this.getUserData();
    const isAuth = this.isAuthenticated();
    const timeRemaining = this.getTimeRemaining();

    return {
      isAuthenticated: isAuth,
      username: userData?.username || null,
      tokenId: token ? `${token.substring(0, 10)}...` : null,
      timeRemaining,
      timeRemainingHours: (timeRemaining / (1000 * 60 * 60)).toFixed(2),
      expiresAt: this._timestamp ? new Date(this._timestamp + TOKEN_EXPIRY_MS).toLocaleString() : null,
      storage: {
        hasTokenInStorage: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
        hasUserDataInStorage: !!localStorage.getItem(STORAGE_KEYS.USER_DATA),
        hasTimestampInStorage: !!localStorage.getItem(STORAGE_KEYS.TIMESTAMP)
      }
    };
  },

  /**
   * Initialize - restore auth from localStorage
   * @returns {boolean}
   */
  init() {
    console.log('🔍 Initializing auth store...');
    
    const isAuth = this.isAuthenticated();
    
    if (isAuth) {
      const userData = this.getUserData();
      const timeRemaining = this.getTimeRemaining();
      console.log('✅ Auth restored:', {
        username: userData?.username,
        timeRemaining: `${(timeRemaining / (1000 * 60)).toFixed(0)} minutes`
      });
    } else {
      console.log('ℹ️ No valid authentication found');
    }

    return isAuth;
  },

  /**
   * Debug: Show raw localStorage data
   */
  debugStorage() {
    console.log('🔍 Raw localStorage data:', {
      token: localStorage.getItem(STORAGE_KEYS.TOKEN),
      userData: localStorage.getItem(STORAGE_KEYS.USER_DATA),
      timestamp: localStorage.getItem(STORAGE_KEYS.TIMESTAMP)
    });
    
    console.log('🔓 Decoded data:', {
      token: this.getToken(),
      userData: this.getUserData(),
      timestamp: this._timestamp
    });
  }
};

// Auto-initialize when module loads
authStore.init();

// Default export
export default authStore;