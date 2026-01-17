import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Resetpassword from './pages/Resetpassword'
import Notificationpage from './pages/Notificationpage'
import Friends from './pages/Friends'       
import Profile from './pages/Profile'       
import Error from './pages/Error'
import Navbar from './components/Navbar'
import LikedPosts from "./pages/LikedPosts";
import DeletedPosts from "./pages/DeletedPosts";
import FriendProfile from './pages/FriendProfilepage'
import Settings from "./pages/Settings";
import Chatpopup from './components/Chatpopup'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");

    if (loginTime) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - parseInt(loginTime, 10);
      const sevenDays = 24 * 60 * 60 * 1000 *7;
      if (elapsedTime > sevenDays) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
          <Route path="/notification" element={<Notificationpage />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Liked & Deleted pages */}
          <Route path="/liked-posts" element={<LikedPosts />} />
          <Route path="/deleted-posts" element={<DeletedPosts />} />
          <Route path="/friend/:_id" element={<FriendProfile />} />

          {/* 404 last */}
          <Route path="*" element={<Error />} />
        </Routes>
        <Chatpopup/>
      </BrowserRouter>
    </>
  )
}

export default App
