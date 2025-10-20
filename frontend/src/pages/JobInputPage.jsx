import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function JobInputPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('parsedResume')
    if (!saved) return navigate('/')
    setResume(JSON.parse(saved))
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!jobTitle.trim() || !jobDescription.trim()) return

    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/match-resume', {
        resume,
        job_title: jobTitle,
        job_description: jobDescription,
      })
      localStorage.setItem('matchResult', JSON.stringify(res.data))
      navigate('/result')
    } catch (err) {
      alert('Matching failed: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  if (!resume) return null

  return (
    <div className="min-h-screen job-gradient py-12 px-4 animate-fade-in relative overflow-hidden">
      {/* Floating elements */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg animate-gradient">
            <span className="text-3xl text-white">🎯</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-title mb-2">Match Your Resume</h1>
          <p className="text-gray-600 text-xl">Enter job details to see how well you match</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Parsed Resume Preview */}
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Your Resume</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">👤</span>
                  <span className="font-medium text-gray-700">Name:</span>
                </div>
                <p className="text-gray-800 ml-6">{resume.contact.name || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">📧</span>
                  <span className="font-medium text-gray-700">Email:</span>
                </div>
                <p className="text-gray-800 ml-6">{resume.contact.email || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">📞</span>
                  <span className="font-medium text-gray-700">Phone:</span>
                </div>
                <p className="text-gray-800 ml-6">{resume.contact.phone || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">🛠️</span>
                  <span className="font-medium text-gray-700">Skills:</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 ml-6">
                  {resume.skills.map((skill, i) => (
                    <span key={i} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium border border-blue-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Input Form */}
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                <span className="text-2xl">💼</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Job Details</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Senior Python Developer"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows="6"
                  className="input-field resize-none"
                  placeholder="Paste the full job description here..."
                />
              </div>
              <button
                type="submit"
                disabled={loading || !jobTitle.trim() || !jobDescription.trim()}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                  loading || !jobTitle.trim() || !jobDescription.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Match...
                  </div>
                ) : (
                  'Get Match Score'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Our AI analyzes your resume against the job requirements to provide a detailed match score and highlight relevant skills.
          </p>
        </div>
      </div>
    </div>
  )
}
