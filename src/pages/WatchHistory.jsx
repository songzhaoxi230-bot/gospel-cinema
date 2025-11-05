import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WatchHistory.css';

const WatchHistory = () => {
  const navigate = useNavigate();
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filterType, setFilterType] = useState('all'); // all, movie, animation
  const [sortBy, setSortBy] = useState('recent'); // recent, oldest, title

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  const fetchWatchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/watch-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('获取观看历史失败');
      }

      const data = await response.json();
      setWatchHistory(data.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('获取观看历史失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredHistory.map(h => h.id)));
    }
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      alert('请选择要删除的项目');
      return;
    }

    if (!window.confirm(`确定要删除 ${selectedItems.size} 条记录吗？`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      for (const id of selectedItems) {
        const history = watchHistory.find(h => h.id === id);
        if (history) {
          await fetch(`http://localhost:5000/api/watch-history/${history.movieId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }

      setWatchHistory(watchHistory.filter(h => !selectedItems.has(h.id)));
      setSelectedItems(new Set());
      alert('删除成功');
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('确定要清空所有观看历史吗？此操作不可撤销。')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/watch-history/clear/all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setWatchHistory([]);
      setSelectedItems(new Set());
      alert('观看历史已清空');
    } catch (err) {
      alert('清空失败: ' + err.message);
    }
  };

  const handleWatchAgain = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const history = watchHistory.find(h => h.id === id);
      if (history) {
        await fetch(`http://localhost:5000/api/watch-history/${history.movieId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setWatchHistory(watchHistory.filter(h => h.id !== id));
        alert('已删除');
      }
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  };

  // 过滤和排序
  let filteredHistory = watchHistory.filter(h => {
    if (filterType === 'all') return true;
    return h.movieType === filterType;
  });

  if (sortBy === 'oldest') {
    filteredHistory = [...filteredHistory].reverse();
  } else if (sortBy === 'title') {
    filteredHistory = [...filteredHistory].sort((a, b) => 
      a.movieTitle.localeCompare(b.movieTitle)
    );
  }

  if (loading) {
    return <div className="watch-history-container loading">加载中...</div>;
  }

  return (
    <div className="watch-history-container">
      <div className="watch-history-header">
        <h1>📺 观看历史</h1>
        <p className="subtitle">共 {watchHistory.length} 条记录</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {watchHistory.length > 0 ? (
        <>
          <div className="watch-history-controls">
            <div className="control-group">
              <label>类型筛选:</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">全部</option>
                <option value="movie">电影</option>
                <option value="animation">动画</option>
              </select>
            </div>

            <div className="control-group">
              <label>排序方式:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">最近观看</option>
                <option value="oldest">最早观看</option>
                <option value="title">按标题</option>
              </select>
            </div>

            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredHistory.length && filteredHistory.length > 0}
                  onChange={handleSelectAll}
                />
                全选
              </label>
            </div>

            <div className="control-buttons">
              {selectedItems.size > 0 && (
                <button className="btn-delete" onClick={handleDeleteSelected}>
                  🗑️ 删除选中 ({selectedItems.size})
                </button>
              )}
              <button className="btn-clear" onClick={handleClearAll}>
                🧹 清空全部
              </button>
              <button className="btn-refresh" onClick={fetchWatchHistory}>
                🔄 刷新
              </button>
            </div>
          </div>

          <div className="watch-history-list">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((history) => (
                <div key={history.id} className="watch-history-item">
                  <div className="item-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(history.id)}
                      onChange={() => handleSelectItem(history.id)}
                    />
                  </div>

                  <div className="item-poster">
                    <img src={history.moviePoster} alt={history.movieTitle} />
                    {history.progress > 0 && (
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${history.progress}%` }}></div>
                      </div>
                    )}
                  </div>

                  <div className="item-info">
                    <h3>{history.movieTitle}</h3>
                    <p className="type-badge">{history.movieType === 'movie' ? '🎬 电影' : '🎨 动画'}</p>
                    <p className="watch-date">
                      观看时间: {new Date(history.watchedAt).toLocaleString('zh-CN')}
                    </p>
                    {history.progress > 0 && (
                      <p className="watch-progress">观看进度: {history.progress}%</p>
                    )}
                    {history.duration > 0 && (
                      <p className="watch-duration">观看时长: {Math.round(history.duration / 60)} 分钟</p>
                    )}
                  </div>

                  <div className="item-actions">
                    <button 
                      className="btn-watch-again"
                      onClick={() => handleWatchAgain(history.movieId)}
                    >
                      ▶️ 继续观看
                    </button>
                    <button 
                      className="btn-delete-item"
                      onClick={() => handleDeleteItem(history.id)}
                    >
                      🗑️ 删除
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>该分类下没有观看记录</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>📭 还没有观看历史</p>
          <p>开始浏览电影库，您的观看记录将显示在这里</p>
          <button className="btn-browse" onClick={() => navigate('/movies')}>
            🎬 浏览电影
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchHistory;

