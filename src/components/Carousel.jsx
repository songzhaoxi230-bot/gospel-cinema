import React, { useState, useEffect } from 'react'
import './Carousel.css'

function Carousel({ movies }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay || movies.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay, movies.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length)
    setAutoPlay(false)
  }

  if (movies.length === 0) return null

  const currentMovie = movies[currentSlide]

  return (
    <div 
      className="carousel"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* 背景图片 */}
      <div className="carousel-background">
        <img src={currentMovie.poster} alt={currentMovie.title} />
        <div className="carousel-overlay"></div>
      </div>

      {/* 内容 */}
      <div className="carousel-content">
        <div className="carousel-text">
          <h1 className="carousel-title">{currentMovie.title}</h1>
          <p className="carousel-description">{currentMovie.description}</p>
          <div className="carousel-rating">
            <span className="rating-stars">★ {currentMovie.rating}</span>
          </div>
          <div className="carousel-buttons">
            <button className="btn-primary">立即观看</button>
            <button className="btn-secondary">加入收藏</button>
          </div>
        </div>
      </div>

      {/* 导航按钮 */}
      <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
        ‹
      </button>
      <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
        ›
      </button>

      {/* 指示器 */}
      <div className="carousel-indicators">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default Carousel

