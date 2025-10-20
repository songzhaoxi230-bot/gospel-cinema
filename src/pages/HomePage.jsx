import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Carousel from '../components/Carousel'
import MovieCard from '../components/MovieCard'
import './HomePage.css'

function HomePage() {
  const [featuredMovies, setFeaturedMovies] = useState([])
  const [latestMovies, setLatestMovies] = useState([])
  const [latestAnimations, setLatestAnimations] = useState([])

  useEffect(() => {
    // 模拟获取特色电影数据
    const mockFeaturedMovies = [
      {
        id: 1,
        title: '耶稣传',
        poster: 'https://via.placeholder.com/1200x600?text=Jesus+Story',
        description: '耶稣基督的生平故事',
        rating: 9.5
      },
      {
        id: 2,
        title: '十诫',
        poster: 'https://via.placeholder.com/1200x600?text=Ten+Commandments',
        description: '摩西与十诫的故事',
        rating: 9.2
      },
      {
        id: 3,
        title: '大卫王',
        poster: 'https://via.placeholder.com/1200x600?text=King+David',
        description: '大卫王的传奇人生',
        rating: 8.9
      }
    ]

    const mockLatestMovies = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `福音电影 ${i + 1}`,
      poster: `https://via.placeholder.com/300x450?text=Movie+${i + 1}`,
      rating: (8 + Math.random() * 2).toFixed(1),
      year: 2023 + Math.floor(Math.random() * 2)
    }))

    const mockLatestAnimations = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `福音动画 ${i + 1}`,
      poster: `https://via.placeholder.com/300x450?text=Animation+${i + 1}`,
      rating: (7.5 + Math.random() * 2.5).toFixed(1),
      year: 2023 + Math.floor(Math.random() * 2)
    }))

    setFeaturedMovies(mockFeaturedMovies)
    setLatestMovies(mockLatestMovies)
    setLatestAnimations(mockLatestAnimations)
  }, [])

  return (
    <main className="home-page">
      {/* 轮播图 */}
      <Carousel movies={featuredMovies} />

      {/* 最新福音电影 */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">最新福音电影</h2>
          <Link to="/movies" className="view-all-link">
            查看全部 →
          </Link>
        </div>
        <div className="movies-grid">
          {latestMovies.slice(0, 6).map(movie => (
            <MovieCard key={movie.id} movie={movie} type="movie" />
          ))}
        </div>
      </section>

      {/* 最新福音动画 */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">最新福音动画</h2>
          <Link to="/animations" className="view-all-link">
            查看全部 →
          </Link>
        </div>
        <div className="movies-grid">
          {latestAnimations.slice(0, 6).map(animation => (
            <MovieCard key={animation.id} movie={animation} type="animation" />
          ))}
        </div>
      </section>

      {/* 推荐理由 */}
      <section className="features-section">
        <h2 className="section-title">为什么选择我们</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>丰富内容</h3>
            <p>超过100部福音电影和动画</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎬</div>
            <h3>高清画质</h3>
            <p>支持1080P及以上清晰度</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>国内加速</h3>
            <p>全部内容国内可流畅播放</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>社区互动</h3>
            <p>与全球信徒分享和讨论</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage

