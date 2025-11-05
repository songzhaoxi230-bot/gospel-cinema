import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Comments.css';

const Comments = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalComments: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [sortBy, setSortBy] = useState('latest');
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/comments/movie/${movieId}?sort=${sortBy}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('获取评论失败');

      const data = await response.json();
      setComments(data.data || []);
    } catch (err) {
      console.error('获取评论失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/movie/${movieId}/stats`
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('获取评分统计失败:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      alert('请输入评论内容');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movieId,
          rating: newRating,
          content: newComment
        })
      });

      if (!response.ok) throw new Error('发布评论失败');

      const data = await response.json();
      setComments([data.data, ...comments]);
      setNewComment('');
      setNewRating(5);
      fetchStats();
      alert('评论已发布');
    } catch (err) {
      alert('发布评论失败: ' + err.message);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}/like`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(comments.map(c => c.id === commentId ? data.data : c));
      }
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定要删除此评论吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId));
        fetchStats();
        alert('评论已删除');
      }
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  };

  // 过滤评论
  let filteredComments = comments;
  if (filterRating !== 'all') {
    filteredComments = comments.filter(c => c.rating === parseInt(filterRating));
  }

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => interactive && setNewRating(star)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="comments-container">
      <div className="comments-header">
        <h1>💬 评论</h1>
      </div>

      {/* 评分统计 */}
      <div className="rating-stats">
        <div className="rating-overview">
          <div className="average-rating">
            <div className="rating-number">{stats.averageRating}</div>
            <div className="rating-stars">{renderStars(Math.round(stats.averageRating))}</div>
            <div className="rating-count">基于 {stats.totalComments} 条评论</div>
          </div>

          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.distribution?.[rating] || 0;
              const percentage = stats.totalComments > 0 ? (count / stats.totalComments) * 100 : 0;
              return (
                <div key={rating} className="distribution-item">
                  <span className="rating-label">{rating}★</span>
                  <div className="distribution-bar">
                    <div 
                      className="distribution-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 发表评论 */}
      <div className="comment-form">
        <h3>发表您的评论</h3>
        <div className="form-group">
          <label>评分:</label>
          {renderStars(newRating, true)}
        </div>

        <div className="form-group">
          <label>评论内容:</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="分享您对这部电影的看法..."
            rows="4"
          />
        </div>

        <button className="btn-submit" onClick={handleSubmitComment}>
          发布评论
        </button>
      </div>

      {/* 评论列表控制 */}
      <div className="comments-controls">
        <div className="control-group">
          <label>排序:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">最新</option>
            <option value="helpful">最有帮助</option>
            <option value="rating">评分最高</option>
          </select>
        </div>

        <div className="control-group">
          <label>筛选:</label>
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
            <option value="all">全部</option>
            <option value="5">5星</option>
            <option value="4">4星</option>
            <option value="3">3星</option>
            <option value="2">2星</option>
            <option value="1">1星</option>
          </select>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="comments-list">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : filteredComments.length > 0 ? (
          filteredComments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="user-info">
                  <img src={comment.userAvatar} alt={comment.userName} className="user-avatar" />
                  <div className="user-details">
                    <h4>{comment.userName}</h4>
                    <p className="comment-date">
                      {new Date(comment.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
                <div className="comment-rating">
                  {renderStars(comment.rating)}
                </div>
              </div>

              <p className="comment-content">{comment.content}</p>

              <div className="comment-actions">
                <button 
                  className="btn-like"
                  onClick={() => handleLikeComment(comment.id)}
                >
                  👍 有帮助 ({comment.likes})
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  🗑️ 删除
                </button>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="replies">
                  <h5>回复 ({comment.replies.length})</h5>
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="reply-item">
                      <div className="reply-user">
                        <img src={reply.userAvatar} alt={reply.userName} className="user-avatar" />
                        <div>
                          <strong>{reply.userName}</strong>
                          <p className="reply-date">
                            {new Date(reply.createdAt).toLocaleString('zh-CN')}
                          </p>
                        </div>
                      </div>
                      <p className="reply-content">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>暂无评论，成为第一个评论者吧！</p>
          </div>
        )}
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

export default Comments;

