import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/PlaylistManager.css';

export default function PlaylistManager() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistMovies, setPlaylistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    isPublic: false
  });
  const navigate = useNavigate();

  // 获取收藏夹列表
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/playlists', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setPlaylists(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedPlaylist(data.data[0].id);
          fetchPlaylistMovies(data.data[0].id);
        }
      } else {
        setError(data.message || '获取收藏夹列表失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 获取收藏夹中的电影
  const fetchPlaylistMovies = async (playlistId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/playlists/${playlistId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setPlaylistMovies(data.data.movies || []);
      }
    } catch (err) {
      console.error('获取收藏夹电影失败:', err);
    }
  };

  // 创建收藏夹
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('收藏夹名称不能为空');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/playlists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('收藏夹创建成功');
        setFormData({ name: '', description: '', icon: '📁', isPublic: false });
        setShowCreateForm(false);
        fetchPlaylists();
        setTimeout(() => setMessage(''), 2000);
      } else {
        setError(data.message || '创建收藏夹失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    }
  };

  // 更新收藏夹
  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('收藏夹名称不能为空');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/playlists/${editingPlaylist.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('收藏夹更新成功');
        setFormData({ name: '', description: '', icon: '📁', isPublic: false });
        setShowEditForm(false);
        setEditingPlaylist(null);
        fetchPlaylists();
        setTimeout(() => setMessage(''), 2000);
      } else {
        setError(data.message || '更新收藏夹失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    }
  };

  // 删除收藏夹
  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('确定要删除这个收藏夹吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('收藏夹删除成功');
        if (selectedPlaylist === playlistId) {
          setSelectedPlaylist(null);
          setPlaylistMovies([]);
        }
        fetchPlaylists();
        setTimeout(() => setMessage(''), 2000);
      } else {
        setError(data.message || '删除收藏夹失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    }
  };

  // 从收藏夹移除电影
  const handleRemoveMovie = async (movieId) => {
    if (!selectedPlaylist) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/playlists/${selectedPlaylist}/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('电影已移除');
        fetchPlaylistMovies(selectedPlaylist);
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    }
  };

  // 清空收藏夹
  const handleClearPlaylist = async () => {
    if (!selectedPlaylist) return;

    if (!window.confirm('确定要清空这个收藏夹中的所有电影吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/playlists/${selectedPlaylist}/clear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        fetchPlaylistMovies(selectedPlaylist);
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    }
  };

  // 打开编辑表单
  const openEditForm = (playlist) => {
    setEditingPlaylist(playlist);
    setFormData({
      name: playlist.name,
      description: playlist.description,
      icon: playlist.icon,
      isPublic: playlist.isPublic
    });
    setShowEditForm(true);
  };

  if (loading) {
    return (
      <div className="playlist-manager-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  const currentPlaylist = playlists.find(p => p.id === selectedPlaylist);

  return (
    <div className="playlist-manager-container">
      <div className="playlist-manager-header">
        <h1>📚 我的收藏夹</h1>
        <p>管理和组织您的电影收藏</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <div className="playlist-manager-content">
        {/* 左侧：收藏夹列表 */}
        <div className="playlist-sidebar">
          <div className="sidebar-header">
            <h2>收藏夹列表</h2>
            <button 
              className="create-btn"
              onClick={() => {
                setShowCreateForm(true);
                setFormData({ name: '', description: '', icon: '📁', isPublic: false });
              }}
            >
              + 新建
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="empty-playlists">
              <p>还没有创建任何收藏夹</p>
              <button 
                className="action-button"
                onClick={() => setShowCreateForm(true)}
              >
                创建第一个收藏夹
              </button>
            </div>
          ) : (
            <div className="playlists-list">
              {playlists.map(playlist => (
                <div 
                  key={playlist.id}
                  className={`playlist-item ${selectedPlaylist === playlist.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPlaylist(playlist.id);
                    fetchPlaylistMovies(playlist.id);
                  }}
                >
                  <div className="playlist-item-header">
                    <span className="playlist-icon">{playlist.icon}</span>
                    <div className="playlist-item-info">
                      <h3>{playlist.name}</h3>
                      <p>{playlist.movies.length} 部电影</p>
                    </div>
                  </div>
                  <div className="playlist-item-actions">
                    <button 
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(playlist);
                      }}
                      title="编辑"
                    >
                      ✎
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlaylist(playlist.id);
                      }}
                      title="删除"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右侧：收藏夹详情 */}
        <div className="playlist-detail">
          {currentPlaylist ? (
            <>
              <div className="detail-header">
                <div className="detail-title">
                  <span className="detail-icon">{currentPlaylist.icon}</span>
                  <div>
                    <h2>{currentPlaylist.name}</h2>
                    {currentPlaylist.description && (
                      <p className="detail-description">{currentPlaylist.description}</p>
                    )}
                  </div>
                </div>
                <div className="detail-stats">
                  <span className="stat">📺 {currentPlaylist.movies.length} 部</span>
                  <span className="stat">📅 {new Date(currentPlaylist.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>

              {currentPlaylist.movies.length === 0 ? (
                <div className="empty-movies">
                  <p>这个收藏夹还没有电影</p>
                  <button 
                    className="action-button"
                    onClick={() => navigate('/movies')}
                  >
                    去浏览电影
                  </button>
                </div>
              ) : (
                <>
                  <div className="detail-actions">
                    <button 
                      className="action-button clear-btn"
                      onClick={handleClearPlaylist}
                    >
                      清空收藏夹
                    </button>
                  </div>

                  <div className="movies-list">
                    {currentPlaylist.movies.map((movieId, index) => (
                      <div key={movieId} className="movie-item">
                        <div className="movie-index">{index + 1}</div>
                        <div className="movie-info">
                          <p className="movie-id">{movieId}</p>
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => handleRemoveMovie(movieId)}
                        >
                          移除
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="no-selection">
              <p>请选择一个收藏夹</p>
            </div>
          )}
        </div>
      </div>

      {/* 创建收藏夹表单 */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>创建新收藏夹</h2>
            <form onSubmit={handleCreatePlaylist}>
              <div className="form-group">
                <label>收藏夹名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="输入收藏夹名称"
                  maxLength="50"
                />
              </div>

              <div className="form-group">
                <label>描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="输入收藏夹描述（可选）"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>图标</label>
                <div className="icon-picker">
                  {['📁', '🎬', '❤️', '⭐', '🎯', '🎨', '🎭', '🎪'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  />
                  <span>公开此收藏夹</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">创建</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑收藏夹表单 */}
      {showEditForm && (
        <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>编辑收藏夹</h2>
            <form onSubmit={handleUpdatePlaylist}>
              <div className="form-group">
                <label>收藏夹名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="输入收藏夹名称"
                  maxLength="50"
                />
              </div>

              <div className="form-group">
                <label>描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="输入收藏夹描述（可选）"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>图标</label>
                <div className="icon-picker">
                  {['📁', '🎬', '❤️', '⭐', '🎯', '🎨', '🎭', '🎪'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  />
                  <span>公开此收藏夹</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">保存</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditForm(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

