import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserRole } from '../types';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  contractorProfileId?: string;
  createdAt?: any;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: (preferredRole?: UserRole) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (
    email: string,
    pass: string,
    name?: string,
    role?: UserRole,
    companyName?: string,
    phone?: string
  ) => Promise<void>;
  updateUserRole: (newRole: UserRole, companyName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  updateUserRole: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync or create user profile in Firestore
  const syncProfile = async (user: User, preferredRole?: UserRole) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      const isPlatformAdmin = user.email === 'rob.anub@gmail.com' || (user.email && user.email.endsWith('@admin.costtofinish.com'));
      
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        if (isPlatformAdmin && data.role !== 'admin') {
          await updateDoc(userRef, { role: 'admin' });
          setUserProfile({ ...data, role: 'admin' });
        } else {
          setUserProfile(data);
        }
      } else {
        const newProfile: UserProfile = {
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || undefined,
          role: isPlatformAdmin ? 'admin' : (preferredRole || 'homeowner'),
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Could not sync user profile to Firestore:', err);
      const isPlatformAdmin = user.email === 'rob.anub@gmail.com';
      setUserProfile({
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'User',
        role: isPlatformAdmin ? 'admin' : (preferredRole || 'homeowner'),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (preferredRole?: UserRole) => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user) {
        await syncProfile(cred.user, preferredRole);
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await syncProfile(cred.user);
    }
  };

  const signupWithEmail = async (
    email: string,
    pass: string,
    name?: string,
    role: UserRole = 'homeowner',
    companyName?: string,
    phone?: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      const userRef = doc(db, 'users', cred.user.uid);
      const newProfile: UserProfile = {
        userId: cred.user.uid,
        email: cred.user.email || '',
        displayName: name || email.split('@')[0] || 'User',
        role,
        companyName,
        phone,
        createdAt: serverTimestamp(),
      };
      try {
        await setDoc(userRef, newProfile);
      } catch (e) {
        console.warn('Set doc profile error', e);
      }
      setUserProfile(newProfile);
    }
  };

  const updateUserRole = async (newRole: UserRole, companyName?: string) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updates: any = { role: newRole };
      if (companyName) updates.companyName = companyName;
      await updateDoc(userRef, updates);
      setUserProfile((prev) => (prev ? { ...prev, role: newRole, companyName: companyName || prev.companyName } : null));
    } catch (err) {
      console.warn('Could not update role:', err);
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithGoogle,
        loginWithEmail,
        signupWithEmail,
        updateUserRole,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
