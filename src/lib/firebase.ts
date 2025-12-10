import { FirebaseOptions } from 'firebase/app';

// Mock Firebase implementation

let mockUser: User = { email: 'manager@hotel.com', uid: '123' };
let authStateListener: ((user: User) => void) | null = null;

const firebaseConfig: FirebaseOptions = {
  apiKey: "mock-api-key",
  authDomain: "mock.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock.appspot.com",
  messagingSenderId: "mock-sender-id",
  appId: "mock-app-id",
};

const mockAuth = {
  onAuthStateChanged: (auth: any, callback: (user: User) => void) => {
    if (typeof callback === 'function') {
      authStateListener = callback;
      // Simulate async user fetch
      setTimeout(() => {
        if (authStateListener) {
            authStateListener(mockUser);
        }
      }, 1000);
    }
    return () => {
        authStateListener = null; // Unsubscribe
    };
  },
  signInWithEmailAndPassword: async (auth: any, email: string, pass: string) => {
    if (email === 'manager@hotel.com' && pass === 'password123') {
        mockUser = { email: 'manager@hotel.com', uid: '123' };
        if (authStateListener) {
            authStateListener(mockUser);
        }
        return { user: mockUser };
    }
    const error = new Error('Invalid credentials');
    (error as any).code = 'auth/invalid-credential';
    throw error;
  },
  signOut: async () => {
    mockUser = null;
    if (authStateListener) {
        authStateListener(mockUser);
    }
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
