import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Welcome from './components/Welcome';
import UpdateProfilePage from './components/UpdateProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/update-profile" element={<UpdateProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
