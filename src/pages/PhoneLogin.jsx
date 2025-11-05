import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../pages/Auth.css';

export default function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1: 输入手机号, 2: 输入验证码
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [generatedCode, setGeneratedCode] = useState(''); // 演示用
  const navigate = useNavigate();

  // 倒计时
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 发送验证码
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!phone) {
      setError('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入有效的手机号');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedCode(data.code); // 演示模式下显示验证码
        setMessage(`验证码已发送到 ${phone}（演示模式：${data.code}）`);
        setStep(2);
        setCountdown(60);
      } else {
        setError(data.message || '发送验证码失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 验证码登录
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!code) {
      setError('请输入验证码');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, code })
      });

      const data = await response.json();

      if (data.success) {
        // 保存令牌和用户信息
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('登录成功！');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError(data.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🎬 手机号登录</h2>
          <p>兆西福音电影院</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={step === 1 ? handleSendCode : handleVerifyCode} className="auth-form">
          {step === 1 ? (
            <>
              <div className="form-group">
                <label>手机号</label>
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  maxLength="11"
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? '发送中...' : '获取验证码'}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>手机号</label>
                <input
                  type="tel"
                  value={phone}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>验证码</label>
                <div className="code-input-group">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    disabled={loading}
                    maxLength="6"
                  />
                  <button
                    type="button"
                    className="resend-button"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || loading}
                  >
                    {countdown > 0 ? `${countdown}秒后重新发送` : '重新发送'}
                  </button>
                </div>
              </div>

              {generatedCode && (
                <div className="demo-code">
                  <small>演示模式 - 验证码：{generatedCode}</small>
                </div>
              )}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? '登录中...' : '登录'}
              </button>

              <button
                type="button"
                className="back-button"
                onClick={() => {
                  setStep(1);
                  setCode('');
                  setError('');
                  setMessage('');
                }}
              >
                ← 返回
              </button>
            </>
          )}
        </form>

        <div className="auth-divider">或</div>

        <div className="auth-links">
          <Link to="/login" className="auth-link">邮箱登录</Link>
          <Link to="/register" className="auth-link">注册账户</Link>
        </div>

        <div className="auth-social">
          <h4>其他登录方式</h4>
          <div className="social-buttons">
            <button className="social-button qq">QQ登录</button>
            <button className="social-button wechat">微信登录</button>
          </div>
        </div>
      </div>
    </div>
  );
}

