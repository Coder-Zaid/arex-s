
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfE6_BNyh3GLEkRsb0A4JJlF7e-BZM7w0",
  authDomain: "arex-e-commerce.firebaseapp.com",
  projectId: "arex-e-commerce",
  storageBucket: "arex-e-commerce.appspot.com",
  messagingSenderId: "282741089412",
  appId: "1:282741089412:web:a1498e8d91c14ad73e52db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { auth, googleProvider, appleProvider };
