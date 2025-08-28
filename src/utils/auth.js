// utils/auth.js - Authentication utility functions

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null; // Return null if cookie not found
}


/**
 * Check if user has a valid session
 * @returns {boolean} - True if session exists
 */
export const hasValidSession = () => {
  const sessionId = getCookie("sessionId");
  console.log("Session ID:", sessionId);
  return sessionId !== null && sessionId !== "";
};

/**
 * Remove session cookie (logout)
 */
export const clearSession = () => {
  document.cookie =
    document.cookie
      .split(";")
      .map((cookie) => cookie.split("=")[0].trim())
      .filter((name) => name !== "sessionId")
      .map((name) => `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`)
      .join("; ") + "; path=/; SameSite=Lax";
};

/**
 * Check session validity with the server
 * @returns {Promise<boolean>} - True if session is valid
 */
export const validateSession = async () => {
  // Just check if session cookie exists
  // The actual validation will happen when we make API calls
  return hasValidSession();
};
