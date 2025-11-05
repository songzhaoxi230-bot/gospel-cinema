import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Following.css';

const Following = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('following'); // following, followers
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [stats, setStats] = useState({ followerCount: 0, followingCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // 获取关注列表
      const followingResponse = await fetch('http://localhost:5000/api/follows/following/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 获取粉丝列表
      const followersResponse = await fetch('http://localhost:5000/api/follows/followers/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 获取统计信息
      const statsResponse = await fetch('http://localhost:5000/api/follows/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (followingResponse.ok) {
        const data = await followingResponse.json();
        setFollowing(data.data || []);
      }

      if (followersResponse.ok) {
        const data = await followersResponse.json();
        setFollowers(data.data || []);
      }

      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('获取数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    if (!window.confirm('确定要取消关注此用户吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/follows/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFollowing(following.filter(u => u.id !== userId));
        setStats(prev => ({
          ...prev,
          followingCount: prev.followingCount - 1
        }));
        alert('已取消关注');
      }
    } catch (err) {
      alert('取消关注失败: ' + err.message);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/follows', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          followingId: userId
        })
      });

      if (response.ok) {
        // 从粉丝列表中找到用户并添加到关注列表
        const user = followers.find(u => u.id === userId);
        if (user) {
          setFollowing([...following, user]);
          setStats(prev => ({
            ...prev,
            followingCount: prev.followingCount + 1
          }));
        }
        alert('已关注');
      }
    } catch (err) {
      alert('关注失败: ' + err.message);
    }
  };

  const renderUserList = (users, isFollowing = true) => {
    return (
      <div className="users-list">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <div className="user-details">
                  <h4>{user.name}</h4>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>

              <button
                className={`btn-action ${isFollowing ? 'btn-unfollow' : 'btn-follow'}`}
                onClick={() => isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
              >
                {isFollowing ? '✓ 已关注' : '+ 关注'}
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>暂无用户</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="following-container loading">加载中...</div>;
  }

  return (
    <div className="following-container">
      <div className="following-header">
        <h1>👥 用户关注</h1>
      </div>

      {/* 统计信息 */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <p className="stat-label">关注中</p>
            <p className="stat-value">{stats.followingCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <p className="stat-label">粉丝</p>
            <p className="stat-value">{stats.followerCount}</p>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          👤 关注中 ({stats.followingCount})
        </button>
        <button
          className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
        >
          ⭐ 粉丝 ({stats.followerCount})
        </button>
      </div>

      {/* 内容 */}
      <div className="tab-content">
        {activeTab === 'following' && renderUserList(following, true)}
        {activeTab === 'followers' && renderUserList(followers, false)}
      </div>

      <button
        className="btn-back"
        onClick={() => navigate(-1)}
      >
        ← 返回
      </button>
    </div>
  );
};

export default Following;

