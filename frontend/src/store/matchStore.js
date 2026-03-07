import { create } from 'zustand';
import { matchAPI } from '../utils/api';

const useMatchStore = create((set) => ({
  matches: [],
  potentialMatches: [],
  loading: false,
  error: null,

  setMatches: (matches) => set({ matches }),
  setPotentialMatches: (potentialMatches) => set({ potentialMatches }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  getMatches: async () => {
    set({ loading: true, error: null });
    try {
      const response = await matchAPI.getMatches();
      set({ matches: response.data.matches, loading: false });
      return response.data.matches;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  findPotentialMatches: async () => {
    set({ loading: true, error: null });
    try {
      const response = await matchAPI.findPotentialMatches();
      set({ potentialMatches: response.data.matches, loading: false });
      return response.data.matches;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createMatch: async (targetUserId) => {
    try {
      const response = await matchAPI.createMatch(targetUserId);
      set((state) => ({
        matches: [...state.matches, response.data.match]
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  blockUser: async (targetUserId) => {
    try {
      await matchAPI.blockUser(targetUserId);
      set((state) => ({
        matches: state.matches.filter((m) => {
          const otherId = m.userId1._id === targetUserId ? m.userId2._id : m.userId1._id;
          return otherId !== targetUserId;
        })
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));

export default useMatchStore;
