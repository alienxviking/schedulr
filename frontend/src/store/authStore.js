import { create } from 'zustand';

// Get user info from localStorage, if it exists
const getInitialUser = () => {
  const user = localStorage.getItem('schedulr_user');
  return user ? JSON.parse(user) : null;
};

export const useAuthStore = create((set) => ({
  // --- State ---
  user: getInitialUser(),

  // --- Actions ---
  
  /**
   * Logs a user in by saving their info to state and localStorage
   */
  login: (userData) => {
    // The userData should be { _id, email, token }
    localStorage.setItem('schedulr_user', JSON.stringify(userData));
    set({ user: userData });
  },

  /**
   * Logs a user out by clearing state and localStorage
   */
  logout: () => {
    localStorage.removeItem('schedulr_user');
    set({ user: null });
  },

  /**
   * Returns the auth token, or null if not logged in
   */
  getToken: () => {
    const { user } = useAuthStore.getState();
    return user ? user.token : null;
  },
}));