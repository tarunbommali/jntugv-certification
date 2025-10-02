/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createOrUpdateUser, getUserProfile } from '../firebase/services';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, additionalData = {}) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile with enhanced schema
    const result = await createOrUpdateUser(user, {
      ...additionalData,
      isAdmin: Boolean(additionalData.isAdmin)
    });
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return userCredential;
  };

  const signin = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signinWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Create or update user profile with Google data
    const profileResult = await createOrUpdateUser(user, {
      // Google OAuth provides these fields automatically
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    });
    
    if (!profileResult.success) {
      console.error('Failed to create/update user profile:', profileResult.error);
    }
    
    return result;
  };
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          // Fetch user profile using the new service
          const profileResult = await getUserProfile(user.uid);
          if (profileResult.success) {
            setUserProfile(profileResult.data);
          } else {
            console.error('Failed to fetch user profile:', profileResult.error);
            // Provide minimal offline-safe profile
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'User',
              isAdmin: false
            });
          }
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          // Provide minimal offline-safe profile
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'User',
            isAdmin: false
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({
    currentUser,
    userProfile,
    signup,
    signin,
    signinWithGoogle,
    logout,
    isAuthenticated: Boolean(currentUser),
    isAdmin: Boolean(userProfile?.isAdmin),
    loading
  }), [currentUser, userProfile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

