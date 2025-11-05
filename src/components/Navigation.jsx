import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navigation.css'

function Navigation({ isLoggedIn, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">兆西福音电影院</span>
        </Link>

        {/* Menu Toggle Button */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            首页
          </Link>
          <Link to="/movies" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            福音电影
          </Link>
          <Link to="/animations" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            福音动画
          </Link>

          {/* User Section */}
          <div className="nav-user">
            {isLoggedIn ? (
              <>
                <span className="user-greeting">欢迎 {user?.username}</span>
                <Link to="/favorites" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  💖 我的收藏
                </Link>
                <Link to="/playlists" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  📚 收藏夹
                </Link>
                <Link to="/watch-history" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  📺 观看历史
                </Link>
                <Link to="/downloads" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  📥 下载管理
                </Link>
                <Link to="/recommendations" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  🌟 推荐
                </Link>
                <Link to="/following" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  👥 关注
                </Link>
                <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  个人中心
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link login-link" onClick={() => setIsMenuOpen(false)}>
                  登录
                </Link>
                <Link to="/register" className="nav-link register-link" onClick={() => setIsMenuOpen(false)}>
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

