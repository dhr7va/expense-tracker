import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Welcome from "./components/Welcome";
import UpdateProfilePage from "./components/UpdateProfilePage";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Expenses from "./components/Expenses";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import PrivateRoute from "./PrivateRoute";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {user && (
          <>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/update-profile" element={<UpdateProfilePage />} />
          </>
        )}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
