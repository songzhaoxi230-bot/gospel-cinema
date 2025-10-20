import React, { useState } from 'react'
import './UserProfile.css'

function UserProfile({ user }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [favorites, setFavorites] = useState([
    { id: 1, title: '福音电影 1', type: '电影', addedDate: '2024-01-15' },
    { id: 2, title: '福音动画 1', type: '动画', addedDate: '2024-01-10' },
    { id: 3, title: '福音电影 2', type: '电影', addedDate: '2024-01-05' }
  ])
  const [watchHistory, setWatchHistory] = useState([
    { id: 1, title: '福音电影 3', type: '电影', watchedDate: '2024-01-20', progress: 85 },
    { id: 2, title: '福音动画 2', type: '动画', watchedDate: '2024-01-18', progress: 100 },
    { id: 3, title: '福音电影 4', type: '电影', watchedDate: '2024-01-16', progress: 45 }
  ])
  const [uploads, setUploads] = useState([
    { id: 1, title: '我上传的福音电影', type: '电影', uploadDate: '2024-01-12', status: '已审核' },
    { id: 2, title: '我上传的福音动画', type: '动画', uploadDate: '2024-01-08', status: '审核中' }
  ])

  const handleDeleteFavorite = (id) => {
    setFavorites(favorites.filter(item => item.id !== id))
  }

  const handleDeleteUpload = (id) => {
    setUploads(uploads.filter(item => item.id !== id))
  }

  return (
    <main className="user-profile-page">
      <div className="profile-container">
        {/* 用户信息卡片 */}
        <div className="profile-header">
          <div className="user-info">
            <img src={user?.avatar} alt={user?.username} className="user-avatar" />
            <div className="user-details">
              <h1>{user?.username}</h1>
              <p className="user-email">{user?.email}</p>
              <p className="user-joined">加入时间：2024年1月</p>
            </div>
          </div>
          <button className="edit-profile-btn">编辑个人资料</button>
        </div>

        {/* 统计信息 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <p className="stat-label">收藏</p>
              <p className="stat-value">{favorites.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <p className="stat-label">观看记录</p>
              <p className="stat-value">{watchHistory.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📤</div>
            <div className="stat-content">
              <p className="stat-label">上传</p>
              <p className="stat-value">{uploads.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <p className="stat-label">观看时长</p>
              <p className="stat-value">24小时</p>
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="tabs-section">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              个人资料
            </button>
            <button 
              className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              我的收藏
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              观看记录
            </button>
            <button 
              className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
              onClick={() => setActiveTab('uploads')}
            >
              我的上传
            </button>
          </div>

          <div className="tabs-content">
            {/* 个人资料标签页 */}
            {activeTab === 'profile' && (
              <div className="tab-pane">
                <form className="profile-form">
                  <div className="form-group">
                    <label>用户名</label>
                    <input type="text" value={user?.username} readOnly className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>邮箱</label>
                    <input type="email" value={user?.email} readOnly className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>密码</label>
                    <button type="button" className="change-password-btn">修改密码</button>
                  </div>
                  <div className="form-group">
                    <label>个人简介</label>
                    <textarea placeholder="添加个人简介..." className="form-textarea"></textarea>
                  </div>
                  <button type="submit" className="save-btn">保存更改</button>
                </form>
              </div>
            )}

            {/* 我的收藏标签页 */}
            {activeTab === 'favorites' && (
              <div className="tab-pane">
                {favorites.length > 0 ? (
                  <div className="items-list">
                    {favorites.map(item => (
                      <div key={item.id} className="item-card">
                        <div className="item-info">
                          <h3>{item.title}</h3>
                          <p className="item-meta">
                            <span className="item-type">{item.type}</span>
                            <span className="item-date">收藏于 {item.addedDate}</span>
                          </p>
                        </div>
                        <div className="item-actions">
                          <button className="action-btn play-btn">播放</button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteFavorite(item.id)}
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>还没有收藏任何内容</p>
                  </div>
                )}
              </div>
            )}

            {/* 观看记录标签页 */}
            {activeTab === 'history' && (
              <div className="tab-pane">
                {watchHistory.length > 0 ? (
                  <div className="items-list">
                    {watchHistory.map(item => (
                      <div key={item.id} className="item-card">
                        <div className="item-info">
                          <h3>{item.title}</h3>
                          <p className="item-meta">
                            <span className="item-type">{item.type}</span>
                            <span className="item-date">观看于 {item.watchedDate}</span>
                          </p>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
                          </div>
                          <p className="progress-text">{item.progress}%</p>
                        </div>
                        <div className="item-actions">
                          <button className="action-btn play-btn">继续观看</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>还没有观看记录</p>
                  </div>
                )}
              </div>
            )}

            {/* 我的上传标签页 */}
            {activeTab === 'uploads' && (
              <div className="tab-pane">
                <div className="upload-section">
                  <button className="upload-btn">+ 上传新内容</button>
                </div>
                {uploads.length > 0 ? (
                  <div className="items-list">
                    {uploads.map(item => (
                      <div key={item.id} className="item-card">
                        <div className="item-info">
                          <h3>{item.title}</h3>
                          <p className="item-meta">
                            <span className="item-type">{item.type}</span>
                            <span className="item-date">上传于 {item.uploadDate}</span>
                            <span className={`status-badge ${item.status === '已审核' ? 'approved' : 'pending'}`}>
                              {item.status}
                            </span>
                          </p>
                        </div>
                        <div className="item-actions">
                          <button className="action-btn edit-btn">编辑</button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteUpload(item.id)}
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>还没有上传任何内容</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default UserProfile

