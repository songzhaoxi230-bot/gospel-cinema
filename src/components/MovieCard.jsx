import React, { useState } from 'react'
import './MovieCard.css'

function MovieCard({ movie, type = 'movie' }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
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

