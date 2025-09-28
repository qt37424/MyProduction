/**
 * Authentication Utility Functions
 * Handle authentication persistence and restoration
 */

// Storage key constants
const AUTH_STORAGE_KEY = '__appAuthData';
const TOKEN_EXPIRY_HOURS = 24; // Token valid for 24 hours

/**
 * Persist authentication data to storage
 * @param {string} token - Authentication token
 * @param {object} userData - User data object
 * @returns {boolean} - Success status
 */
export function persistAuth(token, userData) {
  if (!token || !userData) {
    console.warn('⚠️ persistAuth: Missing token or userData');
    return false;
  }

  try {
    const authData = {
      token,
      userData,
      timestamp: Date.now()
    };

    // In production: use localStorage
    // localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    
    // For Claude artifacts demo: use window object
    window[AUTH_STORAGE_KEY] = authData;
    
    console.log('💾 Auth persisted successfully:', {
      username: userData.username,
      timestamp: new Date(authData.timestamp).toLocaleString()
    });

    return true;
  } catch (error) {
    console.error('❌ Failed to persist auth:', error);
    return false;
  }
}

/**
 * Restore authentication data from storage
 * @returns {object|null} - Auth data object or null if not found/expired
 */
export function restoreAuth() {
  try {
    // In production: use localStorage
    // const authDataString = localStorage.getItem(AUTH_STORAGE_KEY);
    // const authData = authDataString ? JSON.parse(authDataString) : null;
    
    // For Claude artifacts demo: use window object
    const authData = window[AUTH_STORAGE_KEY];

    if (!authData) {
      console.log('ℹ️ No auth data found in storage');
      return null;
    }

    // Check if token is expired
    const hoursSinceLogin = (Date.now() - authData.timestamp) / (1000 * 60 * 60);
    
    if (hoursSinceLogin > TOKEN_EXPIRY_HOURS) {
      console.log('⏰ Auth token expired:', {
        hoursSinceLogin: hoursSinceLogin.toFixed(2),
        expiryLimit: TOKEN_EXPIRY_HOURS
      });
      
      // Clear expired auth
      clearAuth();
      return null;
    }

    console.log('✅ Auth restored successfully:', {
      username: authData.userData.username,
      hoursSinceLogin: hoursSinceLogin.toFixed(2),
      hoursRemaining: (TOKEN_EXPIRY_HOURS - hoursSinceLogin).toFixed(2)
    });

    return authData;
  } catch (error) {
    console.error('❌ Failed to restore auth:', error);
    return null;
  }
}

/**
 * Clear authentication data from storage
 * @returns {boolean} - Success status
 */
export function clearAuth() {
  try {
    // In production: use localStorage
    // localStorage.removeItem(AUTH_STORAGE_KEY);
    
    // For Claude artifacts demo: use window object
    window[AUTH_STORAGE_KEY] = null;
    delete window[AUTH_STORAGE_KEY];

    console.log('🗑️ Auth cleared from storage');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear auth:', error);
    return false;
  }
}

/**
 * Check if authentication data exists in storage
 * @returns {boolean}
 */
export function hasStoredAuth() {
  // In production: return !!localStorage.getItem(AUTH_STORAGE_KEY);
  return !!window[AUTH_STORAGE_KEY];
}

/**
 * Get remaining time before token expires
 * @returns {number|null} - Hours remaining or null if no auth
 */
export function getTokenTimeRemaining() {
  const authData = window[AUTH_STORAGE_KEY];
  
  if (!authData) return null;

  const hoursSinceLogin = (Date.now() - authData.timestamp) / (1000 * 60 * 60);
  const hoursRemaining = TOKEN_EXPIRY_HOURS - hoursSinceLogin;

  return hoursRemaining > 0 ? hoursRemaining : 0;
}

/**
 * Validate token format (basic validation)
 * @param {string} token
 * @returns {boolean}
 */
export function isValidTokenFormat(token) {
  if (!token || typeof token !== 'string') return false;
  
  // Basic validation: token should be at least 10 characters
  if (token.length < 10) return false;
  
  // Add more validation as needed (JWT format, etc.)
  return true;
}

/**
 * Update user data in storage (without changing token)
 * @param {object} userData - New user data
 * @returns {boolean}
 */
export function updateUserData(userData) {
  try {
    const authData = window[AUTH_STORAGE_KEY];
    
    if (!authData) {
      console.warn('⚠️ No auth data to update');
      return false;
    }

    authData.userData = {
      ...authData.userData,
      ...userData
    };

    window[AUTH_STORAGE_KEY] = authData;
    
    console.log('✅ User data updated:', userData);
    return true;
  } catch (error) {
    console.error('❌ Failed to update user data:', error);
    return false;
  }
}

/**
 * Refresh token timestamp (extend session)
 * @returns {boolean}
 */
export function refreshTokenTimestamp() {
  try {
    const authData = window[AUTH_STORAGE_KEY];
    
    if (!authData) {
      console.warn('⚠️ No auth data to refresh');
      return false;
    }

    authData.timestamp = Date.now();
    window[AUTH_STORAGE_KEY] = authData;
    
    console.log('🔄 Token timestamp refreshed');
    return true;
  } catch (error) {
    console.error('❌ Failed to refresh token:', error);
    return false;
  }
}

/**
 * Get current auth status summary
 * @returns {object}
 */
export function getAuthStatus() {
  const authData = window[AUTH_STORAGE_KEY];
  
  if (!authData) {
    return {
      isAuthenticated: false,
      username: null,
      timeRemaining: null,
      lastLogin: null
    };
  }

  const hoursRemaining = getTokenTimeRemaining();
  
  return {
    isAuthenticated: hoursRemaining > 0,
    username: authData.userData?.username || null,
    timeRemaining: hoursRemaining,
    lastLogin: new Date(authData.timestamp).toLocaleString(),
    token: authData.token
  };
}

// Export constants if needed
export const AUTH_CONFIG = {
  STORAGE_KEY: AUTH_STORAGE_KEY,
  TOKEN_EXPIRY_HOURS,
  // Add more config as needed
  MIN_TOKEN_LENGTH: 10,
  AUTO_REFRESH_THRESHOLD_HOURS: 1 // Auto refresh if less than 1 hour remaining
};

// Default export with all functions
export default {
  persistAuth,
  restoreAuth,
  clearAuth,
  hasStoredAuth,
  getTokenTimeRemaining,
  isValidTokenFormat,
  updateUserData,
  refreshTokenTimestamp,
  getAuthStatus,
  AUTH_CONFIG
};