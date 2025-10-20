import React, { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import './MovieList.css'

function MovieList() {
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('latest')

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'drama', name: '剧情' },
    { id: 'historical', name: '历史' },
    { id: 'documentary', name: '纪录' },
    { id: 'family', name: '家庭' },
    { id: 'adventure', name: '冒险' }
  ]

  const itemsPerPage = 12

  useEffect(() => {
    // 模拟获取50部福音电影
    const mockMovies = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `福音电影 ${i + 1}`,
      poster: `https://via.placeholder.com/300x450?text=Gospel+Movie+${i + 1}`,
      rating: (8 + Math.random() * 2).toFixed(1),
      year: 2020 + Math.floor(Math.random() * 4),
      category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
      description: `这是一部关于信仰和救赎的感人故事 ${i + 1}`
    }))
    setMovies(mockMovies)
    setFilteredMovies(mockMovies)
  }, [])

  useEffect(() => {
    let result = movies

    // 按分类筛选
    if (selectedCategory !== 'all') {
      result = result.filter(movie => movie.category === selectedCategory)
    }

    // 按搜索词筛选
    if (searchQuery) {
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
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

    setFilteredMovies(result)
    setCurrentPage(1)
  }, [selectedCategory, searchQuery, sortBy, movies])

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage)

  return (
    <main className="movie-list-page">
      <div className="page-header">
        <h1>福音电影库</h1>
        <p>共 {filteredMovies.length} 部电影</p>
      </div>

      <div className="list-container">
        {/* 侧边栏 */}
        <aside className="sidebar">
          {/* 搜索框 */}
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索电影..."
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
          {paginatedMovies.length > 0 ? (
            <>
              <div className="movies-grid">
                {paginatedMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} type="movie" />
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
              <p>未找到匹配的电影</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default MovieList

