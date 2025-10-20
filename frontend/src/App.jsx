// App.jsx (updated)
import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // New states for job matching
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [matching, setMatching] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Reset results when new file is selected
    setResult(null);
    setMatchResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/parse-resume', formData);
      setResult(res.data);
      setMatchResult(null); // Clear previous match
    } catch (err) {
      alert('Error parsing resume: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    if (!result || !jobTitle.trim() || !jobDescription.trim()) return;

    setMatching(true);
    try {
      const res = await axios.post('http://localhost:8000/match-resume', {
        resume: result,
        job_title: jobTitle,
        job_description: jobDescription,
      });
      setMatchResult(res.data);
    } catch (err) {
      alert('Error matching resume: ' + (err.response?.data?.detail || err.message));
    } finally {
      setMatching(false);
    }
  };

  return (
    <div>
      <div>
        <h1>📄 Resume Parser & Matcher</h1>

        {/* Resume Upload */}
        <form onSubmit={handleSubmit}>
          <h2>Step 1: Upload Resume</h2>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />
          <button
            type="submit"
            disabled={!file || loading}
          >
            {loading ? 'Parsing...' : 'Parse Resume'}
          </button>
        </form>

        {/* Job Input & Matching */}
        {result && (
          <>
            <form onSubmit={handleMatchSubmit}>
              <h2>Step 2: Enter Job Details</h2>

              <div>
                <label>Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Machine Learning Engineer"
                />
              </div>

              <div>
                <label>Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows="4"
                  placeholder="Paste the full job description here..."
                />
              </div>

              <button
                type="submit"
                disabled={!jobTitle.trim() || !jobDescription.trim() || matching}
              >
                {matching ? 'Matching...' : 'Match Resume'}
              </button>
            </form>

            {/* Parsed Resume */}
            <div>
              <h2>Parsed Resume</h2>

              <div>
                <div>
                  <h3>Contact</h3>
                  <p><span>Name:</span> {result.contact.name || 'N/A'}</p>
                  <p><span>Email:</span> {result.contact.email || 'N/A'}</p>
                  <p><span>Phone:</span> {result.contact.phone || 'N/A'}</p>
                </div>

                <div>
                  <h3>Skills</h3>
                  <ul>
                    {result.skills.length > 0 ? (
                      result.skills.map((skill, i) => <li key={i}>{skill}</li>)
                    ) : (
                      <li>No skills detected</li>
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <h3>Experience & Education</h3>
                <p>MVP: Add NER-based parsing in backend for full details.</p>
              </div>
            </div>

            {/* Match Result */}
            {matchResult && (
              <div>
                <h2>🎯 Match Result</h2>
                <div>
                  {matchResult.match_score}%
                </div>
                <p>Relevance score based on skill overlap</p>

                {matchResult.matched_skills.length > 0 ? (
                  <>
                    <h3>✅ Matched Skills</h3>
                    <ul>
                      {matchResult.matched_skills.map((skill, i) => (
                        <li>{skill}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No matching skills found.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}