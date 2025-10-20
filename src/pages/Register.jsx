import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Register({ onLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 验证表单
    if (!username || !email || !password || !confirmPassword) {
      setError('请填写所有字段')
      setLoading(false)
      return
    }

    if (username.length < 3) {
      setError('用户名至少需要3个字符')
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

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }

    // 模拟API调用
    setTimeout(() => {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        username: username,
        email: email,
        avatar: `https://via.placeholder.com/100?text=${username}`
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
          <h1 className="auth-title">创建账户</h1>
          <p className="auth-subtitle">加入兆西福音电影院社区</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </div>

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
                placeholder="请输入密码（至少6个字符）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">确认密码</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <label className="terms-checkbox">
              <input type="checkbox" required />
              <span>我同意<Link to="#" className="terms-link">服务条款</Link>和<Link to="#" className="terms-link">隐私政策</Link></span>
            </label>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? '注册中...' : '创建账户'}
            </button>
          </form>

          <div className="auth-divider">
            <span>或</span>
          </div>

          <div className="social-login">
            <button className="social-btn wechat">微信注册</button>
            <button className="social-btn qq">QQ注册</button>
          </div>

          <p className="auth-footer">
            已有账户？
            <Link to="/login" className="auth-link">立即登录</Link>
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

export default Register

