import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyBuIJ9gGx2eRvKtOVjJyNs8CR6UmqG23QE",
  authDomain: "maintenance-log-89655.firebaseapp.com",
  projectId: "maintenance-log-89655",
  storageBucket: "maintenance-log-89655.appspot.com",
  messagingSenderId: "825309636275",
  appId: "1:825309636275:web:5b41ede2903668897ab2c6"
  
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage()
