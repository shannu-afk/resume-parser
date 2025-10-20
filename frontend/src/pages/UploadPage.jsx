import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/parse-resume', formData)
      localStorage.setItem('parsedResume', JSON.stringify(res.data))
      navigate('/job')
    } catch (err) {
      alert('Error parsing resume: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen upload-gradient animate-fade-in relative overflow-hidden">
      {/* Floating elements */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>

      <section className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur rounded-full px-3 py-1 border border-slate-200 shadow-sm mb-4">
              <span className="text-blue-600 text-xl">⚡</span>
              <span className="text-sm font-semibold text-slate-700">AI-powered resume parsing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{color:'#0f172a'}}>
              Upload your resume and get a <span className="gradient-title">job match</span> instantly
            </h1>
            <p className="text-slate-600 text-lg mb-6">
              Drag & drop your resume and we’ll analyze key skills, contact details and compare with your desired role.
            </p>
            <ul className="text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 list-none">
              <li>✅ PDF, DOCX, or TXT</li>
              <li>✅ Secure and private</li>
              <li>✅ Fast parsing</li>
              <li>✅ Skill insights</li>
            </ul>
          </div>

          {/* Dropzone card */}
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg animate-gradient">
                <span className="text-2xl text-white">📄</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Upload your resume</h2>
              <p className="text-slate-600">We’ll parse and take you to job matching</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : file
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-4">
                    {file ? '✅' : dragActive ? '📂' : '📎'}
                  </div>
                  {file ? (
                    <div>
                      <p className="text-green-600 font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 font-medium mb-1">
                        {dragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                      </p>
                      <p className="text-gray-500 text-sm">or click to browse</p>
                      <p className="text-gray-400 text-xs mt-2">PDF, DOCX, or TXT files accepted</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                  !file || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Parsing Resume...
                  </div>
                ) : (
                  'Parse & Continue'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Your resume data is processed securely and not stored permanently.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
