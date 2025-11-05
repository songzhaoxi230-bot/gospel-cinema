import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Register({ onLogin }) {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    // 验证表单
    if (!email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password, 
          confirmPassword,
          nickname: nickname || '用户'
        })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setMessage('注册成功！')
        if (onLogin) {
          onLogin(data.user)
        }
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        setError(data.message || '注册失败')
      }
    } catch (err) {
      setError('网络错误：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">创建账户</h1>
          <p className="auth-subtitle">加入兆西福音电影院社区</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="form-group">
              <label htmlFor="nickname">昵称（可选）</label>
              <input
                id="nickname"
                type="text"
                placeholder="请输入昵称"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
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
            <button type="button" className="social-btn wechat">微信注册</button>
            <button type="button" className="social-btn qq">QQ注册</button>
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

