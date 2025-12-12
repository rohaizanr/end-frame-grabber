import { useState, useEffect, useCallback } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Auto-download when imageSrc is set
  useEffect(() => {
    if (imageSrc) {
      const link = document.createElement('a')
      link.href = imageSrc
      link.download = 'end-frame.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [imageSrc])

  const processFile = async (selectedFile) => {
    if (!selectedFile) return

    if (selectedFile.type !== 'video/mp4') {
      setError("Only MP4 files are allowed.")
      return
    }

    setFile(selectedFile)
    setLoading(true)
    setError(null)
    setImageSrc(null)

    const formData = new FormData()
    formData.append('video', selectedFile)

    try {
      const response = await fetch('http://localhost:5001/extract-frame', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to extract frame')
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setImageSrc(imageUrl)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
    <div className="container">
      <h1>End Frame Grabber</h1>
      
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${loading ? 'loading' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input 
          type="file" 
          id="fileInput" 
          accept="video/mp4" 
          onChange={onFileInputChange} 
          style={{ display: 'none' }} 
        />
        
        {loading ? (
          <div className="loader">Processing...</div>
        ) : (
          <>
            <div className="arrow-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 16V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p>Drag & Drop MP4 here</p>
            <p className="sub-text">or click to browse</p>
          </>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {imageSrc && (
        <div className="result">
          <h2>Result:</h2>
          <img src={imageSrc} alt="End Frame" />
          <br />
          <p className="success-msg">Image downloaded automatically!</p>
          <a href={imageSrc} download="end-frame.jpg" className="download-btn">Download Again</a>
        </div>
      )}
    </div>
  )
}

export default App
