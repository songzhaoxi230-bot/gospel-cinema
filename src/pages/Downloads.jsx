import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Downloads.css';

const Downloads = () => {
  const navigate = useNavigate();
  const [downloads, setDownloads] = useState([]);
  const [stats, setStats] = useState({ totalCount: 0, totalSize: 0, qualityDistribution: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filterQuality, setFilterQuality] = useState('all'); // all, 480p, 720p, 1080p
  const [sortBy, setSortBy] = useState('recent'); // recent, oldest, title, size

  useEffect(() => {
    fetchDownloads();
    fetchStats();
  }, []);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/downloads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('获取下载列表失败');
      }

      const data = await response.json();
      setDownloads(data.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('获取下载列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/downloads/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('获取统计信息失败:', err);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredDownloads.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredDownloads.map(d => d.id)));
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

    if (!window.confirm(`确定要删除 ${selectedItems.size} 个下载吗？`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      for (const id of selectedItems) {
        await fetch(`http://localhost:5000/api/downloads/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      setDownloads(downloads.filter(d => !selectedItems.has(d.id)));
      setSelectedItems(new Set());
      fetchStats();
      alert('删除成功');
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('确定要清空所有下载吗？此操作不可撤销。')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/downloads/clear/all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDownloads([]);
      setSelectedItems(new Set());
      fetchStats();
      alert('所有下载已清空');
    } catch (err) {
      alert('清空失败: ' + err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/downloads/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDownloads(downloads.filter(d => d.id !== id));
      fetchStats();
      alert('已删除');
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  };

  // 过滤和排序
  let filteredDownloads = downloads.filter(d => {
    if (filterQuality === 'all') return true;
    return d.quality === filterQuality;
  });

  if (sortBy === 'oldest') {
    filteredDownloads = [...filteredDownloads].reverse();
  } else if (sortBy === 'title') {
    filteredDownloads = [...filteredDownloads].sort((a, b) => 
      a.movieTitle.localeCompare(b.movieTitle)
    );
  } else if (sortBy === 'size') {
    filteredDownloads = [...filteredDownloads].sort((a, b) => 
      b.fileSize - a.fileSize
    );
  }

  if (loading) {
    return <div className="downloads-container loading">加载中...</div>;
  }

  return (
    <div className="downloads-container">
      <div className="downloads-header">
        <h1>📥 下载管理</h1>
        <p className="subtitle">共 {downloads.length} 个下载</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {downloads.length > 0 ? (
        <>
          <div className="downloads-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <p className="stat-label">总下载数</p>
                <p className="stat-value">{stats.totalCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💾</div>
              <div className="stat-info">
                <p className="stat-label">总大小</p>
                <p className="stat-value">{formatFileSize(stats.totalSize)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📹</div>
              <div className="stat-info">
                <p className="stat-label">480p</p>
                <p className="stat-value">{stats.qualityDistribution['480p'] || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📹</div>
              <div className="stat-info">
                <p className="stat-label">720p</p>
                <p className="stat-value">{stats.qualityDistribution['720p'] || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📹</div>
              <div className="stat-info">
                <p className="stat-label">1080p</p>
                <p className="stat-value">{stats.qualityDistribution['1080p'] || 0}</p>
              </div>
            </div>
          </div>

          <div className="downloads-controls">
            <div className="control-group">
              <label>画质筛选:</label>
              <select value={filterQuality} onChange={(e) => setFilterQuality(e.target.value)}>
                <option value="all">全部</option>
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>

            <div className="control-group">
              <label>排序方式:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">最新下载</option>
                <option value="oldest">最早下载</option>
                <option value="title">按标题</option>
                <option value="size">按大小</option>
              </select>
            </div>

            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredDownloads.length && filteredDownloads.length > 0}
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
              <button className="btn-refresh" onClick={fetchDownloads}>
                🔄 刷新
              </button>
            </div>
          </div>

          <div className="downloads-list">
            {filteredDownloads.length > 0 ? (
              filteredDownloads.map((download) => (
                <div key={download.id} className="download-item">
                  <div className="item-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(download.id)}
                      onChange={() => handleSelectItem(download.id)}
                    />
                  </div>

                  <div className="item-poster">
                    <img src={download.moviePoster} alt={download.movieTitle} />
                  </div>

                  <div className="item-info">
                    <h3>{download.movieTitle}</h3>
                    <p className="type-badge">{download.movieType === 'movie' ? '🎬 电影' : '🎨 动画'}</p>
                    <p className="download-date">
                      下载时间: {new Date(download.downloadedAt).toLocaleString('zh-CN')}
                    </p>
                    <p className="download-quality">
                      画质: <span className="quality-badge">{download.quality}</span>
                    </p>
                    <p className="download-size">
                      大小: {formatFileSize(download.fileSize)}
                    </p>
                  </div>

                  <div className="item-actions">
                    <button className="btn-delete-item" onClick={() => handleDeleteItem(download.id)}>
                      🗑️ 删除
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>该画质下没有下载</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>📭 还没有下载</p>
          <p>浏览电影库，下载您喜欢的电影以便离线观看</p>
          <button className="btn-browse" onClick={() => navigate('/movies')}>
            🎬 浏览电影
          </button>
        </div>
      )}
    </div>
  );
};

export default Downloads;

