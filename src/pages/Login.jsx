import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (!email || !password) {
      setError('邮箱和密码不能为空')
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

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setMessage('登录成功！')
        if (onLogin) {
          onLogin(data.user)
        }
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        setError(data.message || '登录失败')
      }
    } catch (err) {
      setError('网络错误：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleQQLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/qq/init')
      const data = await response.json()
      if (data.success) {
        window.location.href = data.loginUrl
      }
    } catch (err) {
      setError('QQ登录初始化失败：' + err.message)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">登录账户</h1>
          <p className="auth-subtitle">欢迎回到兆西福音电影院</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

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
            <button type="button" className="social-btn wechat">微信登录</button>
            <button type="button" className="social-btn qq" onClick={handleQQLogin}>QQ登录</button>
          </div>

          <p className="auth-footer">
            <Link to="/phone-login" className="auth-link">手机号登录</Link>
            {' | '}
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

