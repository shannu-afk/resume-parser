import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ResultPage() {
  const [result, setResult] = useState(null)
  const [resume, setResume] = useState(null)
  const [copied, setCopied] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const match = localStorage.getItem('matchResult')
    const res = localStorage.getItem('parsedResume')
    if (!match || !res) return navigate('/')
    setResult(JSON.parse(match))
    setResume(JSON.parse(res))
  }, [navigate])

  const handleNewSearch = () => {
    navigate('/job')
  }

  const handleNewResume = () => {
    localStorage.removeItem('parsedResume')
    localStorage.removeItem('matchResult')
    navigate('/')
  }

  // Helpers
  const getInitials = (name) => {
    if (!name) return 'NA'
    return name
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
  const handleCopy = async (text, label = 'Copied!') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(''), 1500)
    } catch {}
  }

  if (!result || !resume) return null

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'from-green-400 to-green-600', text: 'text-green-600', icon: '🎉' }
    if (score >= 60) return { bg: 'from-yellow-400 to-orange-500', text: 'text-yellow-600', icon: '👍' }
    return { bg: 'from-red-400 to-red-600', text: 'text-red-600', icon: '💪' }
  }

  const scoreStyle = getScoreColor(result.match_score)

  // Skills breakdown
  // Filter out unwanted caste/irrelevant tokens from skills or name
  const scrub = (s) => (s || '').replace(/\bsc\b/gi, '').replace(/\s{2,}/g, ' ').trim()
  const resumeSafe = {
    contact: {
      ...resume.contact,
      name: scrub(resume.contact.name),
      email: scrub(resume.contact.email),
      phone: scrub(resume.contact.phone),
    },
    skills: (Array.isArray(resume.skills) ? resume.skills : []).map(scrub).filter(Boolean)
  }

  const allSkills = resumeSafe.skills
  const matchedSkillsLower = (result.matched_skills || []).map(s => String(s).toLowerCase())
  const unmatchedSkills = allSkills.filter(s => !matchedSkillsLower.includes(String(s).toLowerCase()))

  return (
    <div className="min-h-screen result-gradient py-12 px-4 animate-fade-in relative overflow-hidden">
      {/* Floating elements */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>

      <div className="result-container relative z-10">
        <div className="text-center mb-12">
          <div className={`mx-auto bg-gradient-to-r ${scoreStyle.bg} w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl animate-gradient`}>
            <span className="text-4xl text-white">{scoreStyle.icon}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-title mb-2">Match Result</h1>
          <p className="text-gray-600 text-xl">Here's how you compare to the job</p>
        </div>

        <div className="card overflow-hidden mb-8">
          {/* Score Banner */}
          <div className={`bg-gradient-to-r ${scoreStyle.bg} py-12 text-center text-white`}>
            <div className="text-7xl font-bold mb-2">{result.match_score}%</div>
            <div className="text-xl opacity-90">Match Score</div>
            <div className="mt-4 text-sm opacity-75">
              {result.match_score >= 80 ? 'Excellent match! 🎯' :
               result.match_score >= 60 ? 'Good potential match 📈' :
               'Room for improvement 🚀'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-6 bg-gray-50">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                  result.match_score >= 80 ? 'bg-green-500' :
                  result.match_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.match_score}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>

            {/* Compact stats */}
            <div className="stats-grid mt-6">
              <div className="card p-4 text-center">
                <div className="text-sm text-gray-500">Matched Skills</div>
                <div className="text-2xl font-bold text-gray-800 mt-1">{result.matched_skills.length}</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-sm text-gray-500">Score</div>
                <div className="text-2xl font-bold text-gray-800 mt-1">{result.match_score}%</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-sm text-gray-500">Job Weight Coverage</div>
                <div className="text-2xl font-bold text-gray-800 mt-1">High</div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Candidate Info */}
              <div className="card card-soft p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">Candidate</h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="avatar">
                    {getInitials(resumeSafe.contact.name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-semibold text-lg">{resumeSafe.contact.name || 'N/A'}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <a className="hover:underline" href={`mailto:${resumeSafe.contact.email}`}>{resumeSafe.contact.email || 'N/A'}</a>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <a className="hover:underline" href={`tel:${resumeSafe.contact.phone}`}>{resumeSafe.contact.phone || 'N/A'}</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {resumeSafe.contact.email && (
                    <button onClick={() => handleCopy(resumeSafe.contact.email, 'Email copied!')} className="btn-secondary text-sm px-3 py-2">Copy Email</button>
                  )}
                  {resumeSafe.contact.phone && (
                    <button onClick={() => handleCopy(resumeSafe.contact.phone, 'Phone copied!')} className="btn-secondary text-sm px-3 py-2">Copy Phone</button>
                  )}
                </div>
              </div>

              {/* Matched Skills only */}
              <div className="card card-soft p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Matched Skills ({result.matched_skills.length})
                  </h3>
                </div>
                {result.matched_skills.length > 0 ? (
                  <div className="chips">
                    {result.matched_skills.map((skill, i) => (
                      <span key={i} className="chip">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 italic">No matching skills found.</p>
                    <p className="text-sm text-gray-400 mt-2">Consider updating your resume with relevant skills.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleNewSearch}
                className="flex-1 btn-primary text-center"
              >
                Try Another Job
              </button>
              <button
                onClick={handleNewResume}
                className="flex-1 btn-secondary text-center"
              >
                Upload New Resume
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            This match score is based on skill overlap and keyword analysis. For best results, ensure your resume highlights relevant experience and technical skills.
          </p>
        </div>
      </div>
      {copied && (
        <div className="toast" role="status" aria-live="polite">{copied}</div>
      )}
    </div>
  )
}
