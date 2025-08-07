/**
 * User Store - Zustand store for single user system
 * Manages the single user's profile data and onboarding state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@/types/user';
import { db } from '@/lib/database';

interface UserState {
  // State
  currentUser: UserProfile | null;
  isLoading: boolean;
  isFirstTimeUser: boolean;
  error: string | null;

  // Actions
  initializeUser: () => Promise<void>;
  createUserProfile: (userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
  resetUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isLoading: true,
      isFirstTimeUser: false,
      error: null,
      initializeUser: async () => {
        try {
          set({ isLoading: true, error: null });

          const existingUser = await db.getCurrentUser();
          const isFirstTime = await db.isFirstTimeUser();

          set({
            currentUser: existingUser || null,
            isFirstTimeUser: isFirstTime,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to initialize user:', error);
          set({
            error: 'Failed to load user data',
            isLoading: false,
          });
        }
      },
      createUserProfile: async (userData) => {
        try {
          set({ isLoading: true, error: null });

          const userId = await db.createUser(userData);
          const newUser = await db.getUserById(userId);

          if (newUser) {
            set({
              currentUser: newUser,
              isFirstTimeUser: false,
              isLoading: false,
            });
          } else {
            throw new Error('Failed to retrieve created user');
          }
        } catch (error) {
          console.error('Failed to create user profile:', error);
          set({
            error: 'Failed to create user profile',
            isLoading: false,
          });
          throw error;
        }
      },
      updateUserProfile: async (updates) => {
        try {
          const { currentUser } = get();
          if (!currentUser?.id) {
            throw new Error('No user to update');
          }

          set({ isLoading: true, error: null });

          await db.updateUser(currentUser.id, updates);
          const updatedUser = await db.getUserById(currentUser.id);

          if (updatedUser) {
            set({
              currentUser: updatedUser,
              isLoading: false,
            });
          } else {
            throw new Error('Failed to retrieve updated user');
          }
        } catch (error) {
          console.error('Failed to update user profile:', error);
          set({
            error: 'Failed to update user profile',
            isLoading: false,
          });
          throw error;
        }
      },
      clearError: () => set({ error: null }),
      resetUser: async () => {
        try {
          await db.clearAllData();
          set({
            currentUser: null,
            isFirstTimeUser: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Failed to reset user:', error);
          set({ error: 'Failed to reset user data' });
        }
      },
    }),
    {
      name: 'gym-user-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isFirstTimeUser: state.isFirstTimeUser,
      }),
    }
  )
);

export const useCurrentUser = () => useUserStore((state) => state.currentUser);
export const useIsLoading = () => useUserStore((state) => state.isLoading);
export const useIsFirstTimeUser = () => useUserStore((state) => state.isFirstTimeUser);
export const useUserError = () => useUserStore((state) => state.error);

export const useInitializeUser = () => useUserStore((state) => state.initializeUser);
export const useCreateUserProfile = () => useUserStore((state) => state.createUserProfile);
export const useUpdateUserProfile = () => useUserStore((state) => state.updateUserProfile);
export const useClearError = () => useUserStore((state) => state.clearError);
export const useResetUser = () => useUserStore((state) => state.resetUser);