import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import MovieList from './pages/MovieList'
import AnimationList from './pages/AnimationList'
import UserProfile from './pages/UserProfile'
import Login from './pages/Login'
import Register from './pages/Register'
import PhoneLogin from './pages/PhoneLogin'
import MyFavorites from './pages/MyFavorites'
import PlaylistManager from './pages/PlaylistManager'
import WatchHistory from './pages/WatchHistory'
import Downloads from './pages/Downloads'
import VideoPlayer from './pages/VideoPlayer'
import Comments from './pages/Comments'
import Recommendations from './pages/Recommendations'
import Following from './pages/Following'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // 检查本地存储中的用户信息
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('user')
  }

  return (
    <Router>
      <div className="app">
        <Navigation isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/animations" element={<AnimationList />} />
          <Route path="/profile" element={isLoggedIn ? <UserProfile user={user} /> : <Login onLogin={handleLogin} />} />
          <Route path="/favorites" element={isLoggedIn ? <MyFavorites /> : <Login onLogin={handleLogin} />} />
          <Route path="/playlists" element={isLoggedIn ? <PlaylistManager /> : <Login onLogin={handleLogin} />} />
          <Route path="/watch-history" element={isLoggedIn ? <WatchHistory /> : <Login onLogin={handleLogin} />} />
          <Route path="/downloads" element={isLoggedIn ? <Downloads /> : <Login onLogin={handleLogin} />} />
          <Route path="/video/:movieId" element={isLoggedIn ? <VideoPlayer /> : <Login onLogin={handleLogin} />} />
          <Route path="/comments/:movieId" element={isLoggedIn ? <Comments /> : <Login onLogin={handleLogin} />} />
          <Route path="/recommendations" element={isLoggedIn ? <Recommendations /> : <Login onLogin={handleLogin} />} />
          <Route path="/following" element={isLoggedIn ? <Following /> : <Login onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/phone-login" element={<PhoneLogin onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

