import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAkZ5_k7xtuob1y7lly0zFobPUCnKwI-KU",
    authDomain: "expense-tracker-b35a6.firebaseapp.com",
    projectId: "expense-tracker-b35a6",
    storageBucket: "expense-tracker-b35a6.firebasestorage.app",
    messagingSenderId: "797767823468",
    appId: "1:797767823468:web:c73cb53883f1b0aed12849",
    measurementId: "G-GN6N9QKE45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;