import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/VideoPlayer.css';

const VideoPlayer = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('720p');
  const [subtitles, setSubtitles] = useState(false);
  const [loading, setLoading] = useState(true);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    // 模拟获取电影信息
    const mockMovie = {
      id: movieId,
      title: '耶稣传',
      description: '这是一部关于耶稣生平的福音电影',
      duration: 7200, // 2小时
      poster: 'https://via.placeholder.com/300x400',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // 示例视频
      quality: ['480p', '720p', '1080p'],
      subtitles: ['中文', '英文']
    };
    setMovie(mockMovie);
    setLoading(false);
  }, [movieId]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // 记录观看进度
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      recordWatchProgress(progress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          containerRef.current.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    // 这里可以实现切换视频质量的逻辑
    alert(`已切换到 ${newQuality} 画质`);
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/downloads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movieId: movie.id,
          movieTitle: movie.title,
          moviePoster: movie.poster,
          movieType: 'movie',
          fileSize: 500 * 1024 * 1024, // 500MB
          quality: quality
        })
      });

      if (response.ok) {
        alert(`已添加到下载队列（${quality}）`);
      }
    } catch (err) {
      alert('添加下载失败: ' + err.message);
    }
  };

  const recordWatchProgress = async (progress) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/watch-history', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movieId: movie.id,
          movieTitle: movie.title,
          moviePoster: movie.poster,
          movieType: 'movie',
          duration: currentTime,
          progress: Math.round(progress)
        })
      });
    } catch (err) {
      console.error('记录观看进度失败:', err);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="video-player-container loading">加载中...</div>;
  }

  if (!movie) {
    return <div className="video-player-container error">电影不存在</div>;
  }

  return (
    <div 
      className="video-player-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="player-wrapper">
        <video
          ref={videoRef}
          className="video-element"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={handlePlayPause}
        >
          <source src={movie.videoUrl} type="video/mp4" />
          您的浏览器不支持视频播放
        </video>

        {/* 播放器控制条 */}
        <div className={`player-controls ${showControls ? 'show' : 'hide'}`}>
          {/* 进度条 */}
          <div className="progress-container">
            <div 
              className="progress-bar"
              onClick={handleSeek}
            >
              <div 
                className="progress-fill"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="progress-handle"></div>
              </div>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="controls-bottom">
            <div className="controls-left">
              <button 
                className="control-btn play-btn"
                onClick={handlePlayPause}
                title={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <div className="volume-control">
                <button className="control-btn volume-btn" title="音量">
                  🔊
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  title="音量"
                />
              </div>

              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="controls-right">
              <div className="quality-selector">
                <button className="control-btn quality-btn" title="画质">
                  {quality}
                </button>
                <div className="quality-menu">
                  {movie.quality.map(q => (
                    <button
                      key={q}
                      className={`quality-option ${quality === q ? 'active' : ''}`}
                      onClick={() => handleQualityChange(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className="control-btn subtitle-btn"
                onClick={() => setSubtitles(!subtitles)}
                title={subtitles ? '关闭字幕' : '打开字幕'}
              >
                {subtitles ? '📝' : '📄'}
              </button>

              <button 
                className="control-btn download-btn"
                onClick={handleDownload}
                title="下载"
              >
                📥
              </button>

              <button 
                className="control-btn fullscreen-btn"
                onClick={handleFullscreen}
                title={isFullscreen ? '退出全屏' : '全屏'}
              >
                {isFullscreen ? '⛶' : '⛶'}
              </button>
            </div>
          </div>
        </div>

        {/* 中心播放按钮 */}
        {!isPlaying && (
          <button 
            className="center-play-btn"
            onClick={handlePlayPause}
          >
            ▶
          </button>
        )}
      </div>

      {/* 视频信息 */}
      <div className="video-info">
        <h1>{movie.title}</h1>
        <p className="description">{movie.description}</p>
        
        <div className="info-actions">
          <button className="btn-favorite">💖 加入收藏</button>
          <button className="btn-share">📤 分享</button>
          <button className="btn-comment">💬 评论</button>
        </div>
      </div>

      {/* 返回按钮 */}
      <button 
        className="btn-back"
        onClick={() => navigate(-1)}
      >
        ← 返回
      </button>
    </div>
  );
};

export default VideoPlayer;

