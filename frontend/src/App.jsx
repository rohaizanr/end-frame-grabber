import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const shareRef = useRef(null)

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pageUrl = useMemo(() => {
    try {
      return window.location.href
    } catch {
      return ''
    }
  }, [])

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const shareLinks = useMemo(() => {
    const u = encodeURIComponent(pageUrl || '')
    const text = encodeURIComponent('LastSnap – capture the final frame')
    return {
      x: `https://twitter.com/intent/tweet?url=${u}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      whatsapp: `https://wa.me/?text=${u}`,
      telegram: `https://t.me/share/url?url=${u}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      email: `mailto:?subject=${encodeURIComponent('LastSnap')}&body=${u}`,
    }
  }, [pageUrl])

  const copyToClipboard = async (text) => {
    if (!text) return false

    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      try {
        const el = document.createElement('textarea')
        el.value = text
        el.setAttribute('readonly', '')
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        el.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(el)
        return ok
      } catch {
        return false
      }
    }
  }

  const onCopyLink = async () => {
    const ok = await copyToClipboard(pageUrl)
    setCopyStatus(ok ? 'Copied!' : 'Copy failed')
    window.setTimeout(() => setCopyStatus(''), 1600)
  }

  const onNativeShare = async () => {
    if (!canNativeShare) return
    try {
      await navigator.share({
        title: 'LastSnap',
        text: file?.name
          ? `Final frame extracted from ${file.name}`
          : 'Extract the last frame from your video',
        url: pageUrl,
      })
    } catch {
      // user cancelled; ignore
    }
  }

  const onShareImage = async () => {
    if (!canNativeShare || !imageSrc) return
    try {
      const blob = await (await fetch(imageSrc)).blob()
      const shareFile = new File([blob], 'last-snap.jpg', {
        type: blob.type || 'image/jpeg',
      })

      const canShareFiles =
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [shareFile] })

      if (canShareFiles) {
        await navigator.share({
          title: 'LastSnap',
          text: file?.name
            ? `Final frame image from ${file.name}`
            : 'Final frame image',
          files: [shareFile],
        })
      } else {
        await onNativeShare()
      }
    } catch {
      // ignore
    }
  }

  const resetState = () => {
    setFile(null)
    setImageSrc(null)
    setError(null)
    setUploadProgress(0)
    setCopyStatus('')
  }

  const processFile = async (selectedFile) => {
    if (!selectedFile) return

    if (selectedFile.type !== 'video/mp4') {
      setError("Only MP4 files are supported at this time.")
      return
    }

    setFile(selectedFile)
    setLoading(true)
    setError(null)
    setImageSrc(null)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('video', selectedFile)

    // Use environment variable or default to localhost
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'

    // Use XMLHttpRequest to track upload progress
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100)
        setUploadProgress(percentComplete)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const blob = xhr.response
        const imageUrl = URL.createObjectURL(blob)
        setImageSrc(imageUrl)
        setLoading(false)
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText)
          setError(errorData.error || 'Failed to extract frame')
        } catch {
          setError('Failed to extract frame')
        }
        setLoading(false)
      }
    })

    xhr.addEventListener('error', () => {
      setError('Network error occurred')
      setLoading(false)
    })

    xhr.addEventListener('abort', () => {
      setError('Upload cancelled')
      setLoading(false)
    })

    xhr.responseType = 'blob'
    xhr.open('POST', `${apiUrl}/extract-frame`)
    xhr.send(formData)
  }

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
      e.dataTransfer.clearData()
    }
  }, [])

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  return (
    <>
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <div className="logo">
            <span className="logo-text">
              <span className="logo-text-highlight">Last</span>
              <span className="logo-text-dim"> Snap</span>
            </span>
          </div>
          <nav className="nav-links">
            <a 
              href="https://github.com/rohaizanr/end-frame-grabber" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Background Blobs */}
        <div className="bg-blobs">
          <div className="blob blob-1 animate-blob"></div>
          <div className="blob blob-2 animate-blob animation-delay-2000"></div>
          <div className="blob blob-3 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Section - Two Column Layout */}
        <section className="hero-section">
          <div className="hero-container">
            {/* Left Column - Text Content */}
            <div className="hero-left">
              <span className="hero-badge">Free & Open Source</span>
              <h1 className="hero-title">
                <span className="highlight">Capture the Final <span className="frame-white">Frame</span></span>
              </h1>
              <p className="hero-subtitle">
                Extract the last frame from your video files instantly. 
                Perfect for AI video editing workflows and content creation.
              </p>
              <div className="hero-actions">
                <button 
                  className="cta-button" 
                  onClick={() => !loading && !imageSrc && document.getElementById('fileInput').click()}
                >
                  Upload Video
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <div className="social-links">
                  <a 
                    href="https://github.com/rohaizanr/end-frame-grabber" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                    title="GitHub"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Video Showcase / Result */}
            <div className="hero-right">
              <div className="video-showcase">
                <input 
                  type="file" 
                  id="fileInput" 
                  accept="video/mp4" 
                  onChange={onFileInputChange} 
                  style={{ display: 'none' }} 
                />
                
                {/* Drop Zone - Show when no image */}
                {!imageSrc && (
                  <div 
                    className={`drop-zone ${isDragging ? 'dragging' : ''} ${loading ? 'loading' : ''}`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => !loading && document.getElementById('fileInput').click()}
                  >
                    {loading ? (
                      <div className="loader">
                        <div className="circular-progress">
                          <svg className="progress-ring" width="120" height="120">
                            <circle
                              className="progress-ring-circle-bg"
                              strokeWidth="8"
                              fill="transparent"
                              r="52"
                              cx="60"
                              cy="60"
                            />
                            <circle
                              className="progress-ring-circle"
                              strokeWidth="8"
                              strokeLinecap="round"
                              fill="transparent"
                              r="52"
                              cx="60"
                              cy="60"
                              style={{
                                strokeDasharray: `${2 * Math.PI * 52}`,
                                strokeDashoffset: `${2 * Math.PI * 52 * (1 - uploadProgress / 100)}`
                              }}
                            />
                          </svg>
                          <div className="progress-content">
                            <div className="progress-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </div>
                            <span className="progress-percentage">{uploadProgress}%</span>
                          </div>
                        </div>
                        <span className={`loader-text ${uploadProgress >= 100 ? 'processing' : ''}`}>
                          {uploadProgress >= 100 ? 'Working on it' : 'Uploading'}
                          <span className="animated-dots"></span>
                        </span>
                      </div>
                    ) : (
                      <div className="drop-zone-content">
                        <div className="upload-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <span className="drop-zone-title">Drop your video here</span>
                        <span className="drop-zone-subtitle">
                          or click to browse files
                        </span>
                        <div className="file-types">
                          <span className="file-type-badge">MP4</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="error">
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Result */}
                {imageSrc && (
                  <div className="result">
                    <div className="result-header">
                      <span className="result-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Frame Extracted
                      </span>
                    </div>
                    <div className="result-image-container">
                      <img src={imageSrc} alt="Last Frame" className="result-image" />
                    </div>
                    <div className="result-footer">
                      <span className="success-msg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Ready to download
                      </span>
                      <div className="result-actions">
                        <button onClick={resetState} className="reset-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                          </svg>
                          Reset
                        </button>
                        <a href={imageSrc} download="last-snap.jpg" className="download-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Share Panel */}
                {imageSrc && (
                  <div className="floating-share-panel" ref={shareRef}>
                    <div className="floating-share-item">
                      <a
                        className="floating-share-btn whatsapp-btn"
                        href={shareLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on WhatsApp"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </a>
                      <span className="floating-share-label">WhatsApp</span>
                    </div>
                    <div className="floating-share-item">
                      <a
                        className="floating-share-btn twitter-btn"
                        href={shareLinks.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on X"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                      <span className="floating-share-label">X</span>
                    </div>
                    <div className="floating-share-item">
                      <a
                        className="floating-share-btn facebook-btn"
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on Facebook"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <span className="floating-share-label">Facebook</span>
                    </div>
                    {canNativeShare && (
                      <div className="floating-share-item">
                        <button
                          type="button"
                          className="floating-share-btn more-btn"
                          onClick={imageSrc ? onShareImage : onNativeShare}
                          title="More options"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                        <span className="floating-share-label">More</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Steps */}
        <div className="how-to-section">
          <div className="how-to-header">
            <h2 className="how-to-title">How It Works</h2>
            <p className="how-to-subtitle">
              Extract the last frame from any video in three simple steps.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="step-content">
                <div className="step-number">1</div>
                <h3>Upload Video</h3>
                <p>Drag and drop your MP4 video file or click to browse</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="step-content">
                <div className="step-number">2</div>
                <h3>Auto Extract</h3>
                <p>We automatically extract the final frame from your video</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div className="step-content">
                <div className="step-number">3</div>
                <h3>Download</h3>
                <p>Save or drag the image to your desired location</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <p className="footer-title">LastSnap - Free Version</p>
            <p className="footer-copyright">© {new Date().getFullYear()} Open Source. MIT License.</p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/rohaizanr/end-frame-grabber" target="_blank" rel="noopener noreferrer" className="footer-link">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
