/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Download } from 'lucide-react';

/**
 * VideoPlayer Component
 * 
 * A comprehensive video player component that supports:
 * - YouTube, Vimeo, and direct video URLs
 * - Custom controls with keyboard shortcuts
 * - Progress tracking and resume functionality
 * - Quality selection and fullscreen support
 * - Subtitle support
 * - Download functionality for resources
 */

const VideoPlayer = ({ 
  video, 
  onProgressUpdate, 
  onVideoComplete,
  className = "",
  autoPlay = false,
  showControls = true,
  allowDownload = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Extract video ID and type from URL
  const getVideoInfo = useCallback((url) => {
    if (!url) return { type: 'unknown', id: null };
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return { type: 'youtube', id: youtubeMatch[1] };
    }
    // YouTube bare ID (fallbackData may provide just the ID)
    if (/^[a-zA-Z0-9_-]{6,15}$/.test(url)) {
      return { type: 'youtube', id: url };
    }
    
    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return { type: 'vimeo', id: vimeoMatch[1] };
    }
    
    // Direct video
    if (url.match(/\.(mp4|webm|ogg|avi|mov)$/i)) {
      return { type: 'direct', id: url };
    }
    
    return { type: 'unknown', id: null };
  }, []);

  const videoInfo = getVideoInfo(video?.url);

  // Generate embed URL based on video type
  const getEmbedUrl = useCallback(() => {
    switch (videoInfo.type) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoInfo.id}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&showinfo=0`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoInfo.id}?autoplay=${autoPlay ? 1 : 0}&title=0&byline=0&portrait=0`;
      case 'direct':
        return videoInfo.id;
      default:
        return null;
    }
  }, [videoInfo, autoPlay]);

  // Handle video events
  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
    
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setVolume(videoRef.current.volume || 1);
    }
  }, []);

  const handleVideoError = useCallback((e) => {
    setIsLoading(false);
    setError('Failed to load video. Please check your internet connection.');
    // eslint-disable-next-line no-console
    console.error('Video error:', e);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      
      setCurrentTime(current);
      
      // Update progress callback
      if (onProgressUpdate) {
        onProgressUpdate({
          currentTime: current,
          duration: total,
          percentage: total > 0 ? (current / total) * 100 : 0
        });
      }
      
      // Check if video is complete
      if (total > 0 && current >= total - 1) {
        setIsPlaying(false);
        if (onVideoComplete) {
          onVideoComplete();
        }
      }
    }
  }, [onProgressUpdate, onVideoComplete]);

  // Control functions
  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const restartVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showControls) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeek(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeek(Math.min(duration, currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'r':
          e.preventDefault();
          restartVideo();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showControls, togglePlayPause, handleSeek, currentTime, duration, handleVolumeChange, volume, toggleMute, toggleFullscreen, restartVideo]);

  // Format time helper
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!videoRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    handleSeek(newTime);
  };

  // Render video based on type
  const renderVideo = () => {
    const embedUrl = getEmbedUrl();
    
    if (!embedUrl) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-900 text-white">
          <div className="text-center">
            <p className="text-lg mb-2">Unsupported video format</p>
            <p className="text-sm text-gray-400">Please contact support</p>
          </div>
        </div>
      );
    }

    if (videoInfo.type === 'direct') {
      return (
        <video
          ref={videoRef}
          src={embedUrl}
          className="w-full h-full object-contain"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls={!showControls}
          poster={video?.thumbnail}
        />
      );
    }

    // YouTube or Vimeo embed
    return (
      <iframe
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleVideoLoad}
        onError={handleVideoError}
      />
    );
  };

  if (!video) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 text-white ${className}`}>
        <div className="text-center">
          <p className="text-lg mb-2">No video selected</p>
          <p className="text-sm text-gray-400">Please select a video to play</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
    >
      {/* Video Container */}
      <div className="relative w-full aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
            <div className="text-center">
              <p className="text-red-400 mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {renderVideo()}

        {/* Resources quick access (always visible when resources exist) */}
        {Array.isArray(video?.resources) && video.resources.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            className="absolute top-3 right-3 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-black/70 text-white text-xs hover:bg-black/80"
            title="Resources"
          >
            <Download className="w-4 h-4" />
            Resources
          </button>
        )}
      </div>

      {/* Custom Controls */}
      {showControls && videoInfo.type === 'direct' && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-4"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="hover:text-blue-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button
                onClick={toggleMute}
                className="hover:text-blue-400 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm">{Math.round(volume * 100)}</span>
              </div>
              
              <button
                onClick={restartVideo}
                className="hover:text-blue-400 transition-colors"
                title="Restart (R)"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              
              {allowDownload && video?.resources && video.resources.length > 0 && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="hover:text-blue-400 transition-colors"
                  title="Download Resources"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={toggleFullscreen}
                className="hover:text-blue-400 transition-colors"
                title="Fullscreen (F)"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg min-w-64">
          <h3 className="font-semibold mb-3">Video Resources</h3>
          
          {video?.resources && video.resources.length > 0 ? (
            <div className="space-y-2">
              {video.resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{resource.title}</p>
                    <p className="text-xs text-gray-400">{resource.type.toUpperCase()}</p>
                  </div>
                  <a
                    href={resource.url}
                    download
                    className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No resources available</p>
          )}
          
          <button
            onClick={() => setShowSettings(false)}
            className="mt-3 w-full px-3 py-1 bg-gray-600 rounded text-xs hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded-lg text-xs opacity-0 hover:opacity-100 transition-opacity">
        <div className="space-y-1">
          <p><kbd className="bg-gray-700 px-1 rounded">Space</kbd> Play/Pause</p>
          <p><kbd className="bg-gray-700 px-1 rounded">←</kbd> <kbd className="bg-gray-700 px-1 rounded">→</kbd> Seek</p>
          <p><kbd className="bg-gray-700 px-1 rounded">↑</kbd> <kbd className="bg-gray-700 px-1 rounded">↓</kbd> Volume</p>
          <p><kbd className="bg-gray-700 px-1 rounded">M</kbd> Mute</p>
          <p><kbd className="bg-gray-700 px-1 rounded">F</kbd> Fullscreen</p>
          <p><kbd className="bg-gray-700 px-1 rounded">R</kbd> Restart</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
