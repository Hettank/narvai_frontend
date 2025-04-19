// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api/endpoints/auth';

export const useAuthStore = create(
  persist(
    set => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async data => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(data);
          console.log('log from register store', response);

          const { token, user } = response;

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Login user
      login: async data => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(data);

          const { token, user } = response;

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
      partialize: state => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
