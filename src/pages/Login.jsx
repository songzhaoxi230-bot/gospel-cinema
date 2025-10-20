import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 模拟登录验证
    if (!email || !password) {
      setError('请填写所有字段')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('请输入有效的邮箱地址')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符')
      setLoading(false)
      return
    }

    // 模拟API调用
    setTimeout(() => {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        username: email.split('@')[0],
        email: email,
        avatar: `https://via.placeholder.com/100?text=${email.split('@')[0]}`
      }
      
      onLogin(userData)
      navigate('/')
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">登录账户</h1>
          <p className="auth-subtitle">欢迎回到兆西福音电影院</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">邮箱地址</label>
              <input
                id="email"
                type="email"
                placeholder="请输入邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>记住我</span>
              </label>
              <Link to="#" className="forgot-password">忘记密码？</Link>
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="auth-divider">
            <span>或</span>
          </div>

          <div className="social-login">
            <button className="social-btn wechat">微信登录</button>
            <button className="social-btn qq">QQ登录</button>
          </div>

          <p className="auth-footer">
            还没有账户？
            <Link to="/register" className="auth-link">立即注册</Link>
          </p>
        </div>

        <div className="auth-illustration">
          <div className="illustration-content">
            <div className="illustration-icon">🎬</div>
            <h2>兆西福音电影院</h2>
            <p>发现灵性之光，享受信仰之旅</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login

