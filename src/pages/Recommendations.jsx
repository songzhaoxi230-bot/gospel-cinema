import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Recommendations.css';

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [popular, setPopular] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personalized'); // personalized, popular, new

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // 获取个性化推荐
      const recResponse = await fetch('http://localhost:5000/api/recommendations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 获取热门推荐
      const popResponse = await fetch('http://localhost:5000/api/recommendations/popular');

      // 获取新上映推荐
      const newResponse = await fetch('http://localhost:5000/api/recommendations/new');

      if (recResponse.ok) {
        const data = await recResponse.json();
        setRecommendations(data.data || []);
      }

      if (popResponse.ok) {
        const data = await popResponse.json();
        setPopular(data.data || []);
      }

      if (newResponse.ok) {
        const data = await newResponse.json();
        setNewMovies(data.data || []);
      }
    } catch (err) {
      console.error('获取推荐失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (movie) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movieId: movie.movieId,
          movieTitle: movie.movieTitle,
          moviePoster: movie.moviePoster,
          movieType: movie.movieType
        })
      });

      if (response.ok) {
        alert('已添加到收藏');
      }
    } catch (err) {
      alert('添加失败: ' + err.message);
    }
  };

  const handleWatchMovie = (movieId) => {
    navigate(`/video/${movieId}`);
  };

  const renderMovieGrid = (movies) => {
    return (
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.movieId} className="movie-card">
            <div className="card-poster">
              <img src={movie.moviePoster} alt={movie.movieTitle} />
              <div className="card-overlay">
                <button 
                  className="btn-watch"
                  onClick={() => handleWatchMovie(movie.movieId)}
                >
                  ▶ 观看
                </button>
              </div>
            </div>

            <div className="card-info">
              <h3>{movie.movieTitle}</h3>
              <p className="card-category">{movie.movieCategory}</p>
              <p className="card-reason">{movie.reason}</p>
              <div className="card-rating">
                <span className="rating-score">⭐ {movie.score}</span>
              </div>

              <button 
                className="btn-favorite"
                onClick={() => handleAddToFavorites(movie)}
              >
                💖 收藏
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="recommendations-container loading">加载中...</div>;
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h1>🎬 推荐电影</h1>
        <p className="subtitle">发现适合您的精彩内容</p>
      </div>

      {/* 标签页 */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'personalized' ? 'active' : ''}`}
          onClick={() => setActiveTab('personalized')}
        >
          👤 个性化推荐
        </button>
        <button 
          className={`tab ${activeTab === 'popular' ? 'active' : ''}`}
          onClick={() => setActiveTab('popular')}
        >
          🔥 热门推荐
        </button>
        <button 
          className={`tab ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          ✨ 新上映
        </button>
      </div>

      {/* 内容 */}
      <div className="recommendations-content">
        {activeTab === 'personalized' && (
          <div className="tab-content">
            <h2>根据您的观看历史为您推荐</h2>
            {recommendations.length > 0 ? (
              renderMovieGrid(recommendations)
            ) : (
              <div className="empty-state">
                <p>暂无个性化推荐，观看更多电影以获得推荐</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'popular' && (
          <div className="tab-content">
            <h2>最受欢迎的电影</h2>
            {popular.length > 0 ? (
              renderMovieGrid(popular)
            ) : (
              <div className="empty-state">
                <p>暂无热门推荐</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'new' && (
          <div className="tab-content">
            <h2>最新上映的电影</h2>
            {newMovies.length > 0 ? (
              renderMovieGrid(newMovies)
            ) : (
              <div className="empty-state">
                <p>暂无新上映电影</p>
              </div>
            )}
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

export default Recommendations;

