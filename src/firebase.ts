// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC0__pOBPWaEQ32UFApV28Y4Ap1Mx7owb4',
  authDomain: 'boulder-problem.firebaseapp.com',
  projectId: 'boulder-problem',
  storageBucket: 'boulder-problem.firebasestorage.app',
  messagingSenderId: '412843641051',
  appId: '1:412843641051:web:09b5fa763fa1bdcfe124fe',
  measurementId: 'G-YFGG487ZD1',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
