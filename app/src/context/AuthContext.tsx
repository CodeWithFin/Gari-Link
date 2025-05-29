import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/models';
import { generateId } from '../utils/helpers';

// Storage keys
const USER_STORAGE_KEY = '@garilink:user';
const AUTH_TOKEN_KEY = '@garilink:auth_token';

// Context state type
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Action types
type AuthAction =
  | { type: 'RESTORE_TOKEN'; user: User | null }
  | { type: 'SIGN_IN'; user: User }
  | { type: 'SIGN_OUT' }
  | { type: 'UPDATE_USER'; user: User }
  | { type: 'AUTH_ERROR'; error: string };

// Context type
interface AuthContextType extends AuthState {
  signIn: (phoneNumber: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.user,
        isAuthenticated: action.user !== null,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        user: action.user,
        isAuthenticated: true,
        error: null,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.user,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user data from storage
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
        const user = userJson ? JSON.parse(userJson) : null;
        
        // If there's user data but no auth token, clear the user data
        if (user) {
          const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
          if (!token) {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            dispatch({ type: 'RESTORE_TOKEN', user: null });
            return;
          }
        }
        
        dispatch({ type: 'RESTORE_TOKEN', user });
      } catch (error) {
        console.error('Error restoring authentication state:', error);
        dispatch({ type: 'AUTH_ERROR', error: 'Failed to restore authentication state' });
      }
    };

    bootstrapAsync();
  }, []);

  // Sign in function
  const signIn = async (phoneNumber: string, name: string) => {
    try {
      // In a real app, this would be an API call to verify the phone number
      // For this MVP, we'll mock a successful authentication
      const mockToken = 'mock-auth-token-' + Date.now();
      
      // Create a new user or update existing one
      const user: User = {
        id: generateId(),
        phoneNumber,
        name,
        joinDate: new Date(),
        reputationScore: 0,
      };
      
      // Save user data and token to storage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      
      dispatch({ type: 'SIGN_IN', user });
    } catch (error) {
      console.error('Error signing in:', error);
      dispatch({ type: 'AUTH_ERROR', error: 'Failed to sign in' });
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Error signing out:', error);
      dispatch({ type: 'AUTH_ERROR', error: 'Failed to sign out' });
    }
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!state.user) {
        throw new Error('No user to update');
      }
      
      const updatedUser = { ...state.user, ...userData };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      dispatch({ type: 'AUTH_ERROR', error: 'Failed to update user' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
