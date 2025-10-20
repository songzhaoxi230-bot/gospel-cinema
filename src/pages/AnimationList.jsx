import React, { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import './MovieList.css'

function AnimationList() {
  const [animations, setAnimations] = useState([])
  const [filteredAnimations, setFilteredAnimations] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('latest')

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'children', name: '儿童' },
    { id: 'adventure', name: '冒险' },
    { id: 'comedy', name: '喜剧' },
    { id: 'educational', name: '教育' },
    { id: 'fantasy', name: '奇幻' }
  ]

  const itemsPerPage = 12

  useEffect(() => {
    // 模拟获取50部福音动画
    const mockAnimations = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `福音动画 ${i + 1}`,
      poster: `https://via.placeholder.com/300x450?text=Gospel+Animation+${i + 1}`,
      rating: (7.5 + Math.random() * 2.5).toFixed(1),
      year: 2020 + Math.floor(Math.random() * 4),
      category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
      description: `这是一部适合全家观看的福音动画故事 ${i + 1}`
    }))
    setAnimations(mockAnimations)
    setFilteredAnimations(mockAnimations)
  }, [])

  useEffect(() => {
    let result = animations

    // 按分类筛选
    if (selectedCategory !== 'all') {
      result = result.filter(animation => animation.category === selectedCategory)
    }

    // 按搜索词筛选
    if (searchQuery) {
      result = result.filter(animation =>
        animation.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 排序
    if (sortBy === 'latest') {
      result.sort((a, b) => b.year - a.year)
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredAnimations(result)
    setCurrentPage(1)
  }, [selectedCategory, searchQuery, sortBy, animations])

  const totalPages = Math.ceil(filteredAnimations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAnimations = filteredAnimations.slice(startIndex, startIndex + itemsPerPage)

  return (
    <main className="movie-list-page">
      <div className="page-header">
        <h1>福音动画库</h1>
        <p>共 {filteredAnimations.length} 部动画</p>
      </div>

      <div className="list-container">
        {/* 侧边栏 */}
        <aside className="sidebar">
          {/* 搜索框 */}
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索动画..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>

          {/* 分类筛选 */}
          <div className="filter-section">
            <h3>分类</h3>
            <div className="category-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 排序选项 */}
          <div className="filter-section">
            <h3>排序</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="latest">最新上映</option>
              <option value="rating">评分最高</option>
              <option value="title">按名称</option>
            </select>
          </div>
        </aside>

        {/* 主内容区域 */}
        <div className="main-content">
          {paginatedAnimations.length > 0 ? (
            <>
              <div className="movies-grid">
                {paginatedAnimations.map(animation => (
                  <MovieCard key={animation.id} movie={animation} type="animation" />
                ))}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    上一页
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <p>未找到匹配的动画</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default AnimationList

