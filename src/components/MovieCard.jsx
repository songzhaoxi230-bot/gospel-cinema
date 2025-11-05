import React, { useState, useEffect } from 'react'
import './MovieCard.css'

function MovieCard({ movie, type = 'movie', onFavoriteChange }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  // 检查是否已收藏
  useEffect(() => {
    checkFavoriteStatus()
  }, [movie.id])

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`http://localhost:5000/api/favorites/check/${movie.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.success) {
        setIsFavorite(data.isFavorited)
      }
    } catch (err) {
      console.error('检查收藏状态失败:', err)
    }
  }

  const handleFavorite = async (e) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')

    if (!token) {
      alert('请先登录')
      return
    }

    setLoading(true)
    try {
      if (isFavorite) {
        // 取消收藏
        const response = await fetch(`http://localhost:5000/api/favorites/${movie.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(false)
          if (onFavoriteChange) onFavoriteChange(false)
        }
      } else {
        // 添加收藏
        const response = await fetch('http://localhost:5000/api/favorites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            movieId: movie.id,
            movieTitle: movie.title,
            moviePoster: movie.poster,
            movieRating: movie.rating,
            movieCategory: movie.category || '未分类',
            movieYear: movie.year,
            movieType: type
          })
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorite(true)
          if (onFavoriteChange) onFavoriteChange(true)
        }
      }
    } catch (err) {
      console.error('收藏操作失败:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
        
        {/* 悬停效果 */}
        {isHovered && (
          <div className="movie-overlay">
            <button className="play-btn">▶ 播放</button>
            <button 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavorite}
              disabled={loading}
              title={isFavorite ? '取消收藏' : '添加收藏'}
            >
              ♥
            </button>
          </div>
        )}

        {/* 评分 */}
        <div className="movie-rating">
          <span className="rating-value">★ {movie.rating}</span>
        </div>

        {/* 类型标签 */}
        <div className="movie-type">
          {type === 'movie' ? '电影' : '动画'}
        </div>

        {/* 收藏指示 */}
        {isFavorite && (
          <div className="favorite-indicator">
            ♥
          </div>
        )}
      </div>

      {/* 电影信息 */}
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{movie.year}</p>
      </div>
    </div>
  )
}

export default MovieCard

