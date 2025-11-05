import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/MyFavorites.css';

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filterType, setFilterType] = useState('all'); // all, movie, animation
  const [sortBy, setSortBy] = useState('newest'); // newest, rating, title
  const navigate = useNavigate();

  // 获取收藏列表
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/favorites', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setFavorites(data.data || []);
      } else {
        setError(data.message || '获取收藏列表失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 删除单个收藏
  const handleRemoveFavorite = async (movieId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/favorites/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('已取消收藏');
        setFavorites(favorites.filter(f => f.movieId !== movieId));
        setTimeout(() => setMessage(''), 2000);
      } else {
        setError(data.message || '删除收藏失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    }
  };

  // 批量删除收藏
  const handleBatchRemove = async () => {
    if (selectedItems.size === 0) {
      setError('请选择要删除的收藏');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const movieIds = Array.from(selectedItems);

      const response = await fetch('http://localhost:5000/api/favorites/batch/remove', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movieIds })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setFavorites(favorites.filter(f => !selectedItems.has(f.movieId)));
        setSelectedItems(new Set());
        setTimeout(() => setMessage(''), 2000);
      } else {
        setError(data.message || '批量删除失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    }
  };

  // 清空所有收藏
  const handleClearAll = async () => {
    if (!window.confirm('确定要清空所有收藏吗？此操作无法撤销。')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/favorites/clear/all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setFavorites([]);
        setSelectedItems(new Set());
        setTimeout(() => setMessage(''), 2000);
      } else {
        setError(data.message || '清空失败');
      }
    } catch (err) {
      setError('网络错误：' + err.message);
    }
  };

  // 选择/取消选择
  const toggleSelect = (movieId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(movieId)) {
      newSelected.delete(movieId);
    } else {
      newSelected.add(movieId);
    }
    setSelectedItems(newSelected);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.size === filteredFavorites.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(filteredFavorites.map(f => f.movieId));
      setSelectedItems(allIds);
    }
  };

  // 过滤和排序
  let filteredFavorites = favorites.filter(f => {
    if (filterType === 'all') return true;
    return f.movieType === filterType;
  });

  // 排序
  if (sortBy === 'newest') {
    filteredFavorites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'rating') {
    filteredFavorites.sort((a, b) => b.movieRating - a.movieRating);
  } else if (sortBy === 'title') {
    filteredFavorites.sort((a, b) => a.movieTitle.localeCompare(b.movieTitle));
  }

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>🎬 我的收藏</h1>
        <p>共 {favorites.length} 部</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>还没有收藏任何电影</h2>
          <p>浏览电影库，将喜欢的电影添加到收藏中</p>
          <button className="action-button" onClick={() => navigate('/movies')}>
            浏览电影
          </button>
        </div>
      ) : (
        <>
          {/* 控制栏 */}
          <div className="controls-bar">
            <div className="filters">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">全部</option>
                <option value="movie">电影</option>
                <option value="animation">动画</option>
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">最新收藏</option>
                <option value="rating">评分最高</option>
                <option value="title">按名称</option>
              </select>
            </div>

            <div className="actions">
              <label className="select-all-checkbox">
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredFavorites.length && filteredFavorites.length > 0}
                  onChange={toggleSelectAll}
                />
                <span>全选</span>
              </label>

              {selectedItems.size > 0 && (
                <>
                  <span className="selected-count">已选择 {selectedItems.size} 个</span>
                  <button 
                    className="action-button delete-button"
                    onClick={handleBatchRemove}
                  >
                    删除选中
                  </button>
                </>
              )}

              {favorites.length > 0 && (
                <button 
                  className="action-button clear-button"
                  onClick={handleClearAll}
                >
                  清空所有
                </button>
              )}
            </div>
          </div>

          {/* 收藏列表 */}
          <div className="favorites-grid">
            {filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="favorite-item">
                <div className="favorite-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(favorite.movieId)}
                    onChange={() => toggleSelect(favorite.movieId)}
                  />
                </div>

                <div className="favorite-poster">
                  <img 
                    src={favorite.moviePoster} 
                    alt={favorite.movieTitle}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300?text=' + favorite.movieTitle;
                    }}
                  />
                  <div className="favorite-overlay">
                    <button 
                      className="remove-button"
                      onClick={() => handleRemoveFavorite(favorite.movieId)}
                      title="取消收藏"
                    >
                      ✕ 取消收藏
                    </button>
                  </div>
                </div>

                <div className="favorite-info">
                  <h3 className="favorite-title">{favorite.movieTitle}</h3>
                  
                  <div className="favorite-meta">
                    <span className="rating">⭐ {favorite.movieRating}</span>
                    <span className="year">{favorite.movieYear}</span>
                    <span className={`type ${favorite.movieType}`}>
                      {favorite.movieType === 'movie' ? '电影' : '动画'}
                    </span>
                  </div>

                  <p className="favorite-category">
                    分类：{favorite.movieCategory}
                  </p>

                  <div className="favorite-date">
                    收藏于：{new Date(favorite.createdAt).toLocaleDateString('zh-CN')}
                  </div>

                  <button 
                    className="watch-button"
                    onClick={() => {
                      // 可以跳转到电影详情页或播放页面
                      alert(`即将播放：${favorite.movieTitle}`);
                    }}
                  >
                    立即观看
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFavorites.length === 0 && (
            <div className="no-results">
              <p>没有找到匹配的收藏</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

