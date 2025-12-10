import { FirebaseOptions } from 'firebase/app';

// Mock Firebase implementation
const firebaseConfig: FirebaseOptions = {
  apiKey: "mock-api-key",
  authDomain: "mock.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock.appspot.com",
  messagingSenderId: "mock-sender-id",
  appId: "mock-app-id",
};

const mockAuth = {
  onAuthStateChanged: (auth: any, callback: (user: any) => void) => {
    if (typeof callback === 'function') {
      // Simulate a logged-in user for now
      setTimeout(() => callback({ email: 'manager@hotel.com', uid: '123' }), 1000);
    }
    return () => {}; // Unsubscribe function
  },
  signInWithEmailAndPassword: async (auth: any, email: string, pass: string) => {
    if (email === 'manager@hotel.com' && pass === 'password123') {
        return { user: { email: 'manager@hotel.com', uid: '123' } };
    }
    const error = new Error('Invalid credentials');
    (error as any).code = 'auth/invalid-credential';
    throw error;
  },
  signOut: async () => {
    // Simulate sign out
    return Promise.resolve();
  }
}

const app = {};
const auth = mockAuth;
const db = {};

const onAuthStateChanged = mockAuth.onAuthStateChanged;
const signInWithEmailAndPassword = mockAuth.signInWithEmailAndPassword;
const signOut = mockAuth.signOut;

type User = {
    email: string | null;
    uid: string;
} | null;


export { app, auth, db, onAuthStateChanged, signOut, signInWithEmailAndPassword };
export type { User };
