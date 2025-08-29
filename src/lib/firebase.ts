
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'claritybudgets-wfgt6',
  appId: '1:723074104403:web:028575378a222d65d8daa6',
  storageBucket: 'claritybudgets-wfgt6.firebasestorage.app',
  apiKey: 'AIzaSyCYMrKhV4sPFKDFd6I8CRcDvbd-_LEgvWk',
  authDomain: 'claritybudgets-wfgt6.firebaseapp.com',
  messagingSenderId: '723074104403',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
