# Resume Parser & Matcher App

A modern web application that parses resumes from PDF, DOCX, or TXT files and matches them against job descriptions to provide a compatibility score. Built with a FastAPI backend for robust parsing and a React frontend for an intuitive user experience.

## 🚀 Features

- **Resume Parsing**: Extract contact information, skills, experience, and education from various file formats
- **Skill Matching**: Intelligent matching algorithm that compares resume skills with job requirements
- **Match Scoring**: Provides a percentage-based compatibility score with detailed matched skills
- **Modern UI**: Clean, responsive design with smooth animations and professional styling
- **File Support**: Supports PDF, DOCX, and TXT file formats
- **Real-time Processing**: Fast parsing and matching with progress indicators
- **Cross-platform**: Works on desktop and mobile devices

## 🛠 Tech Stack

### Backend
- **FastAPI**: High-performance web framework for building APIs
- **spaCy**: Natural language processing for text analysis
- **pdfplumber**: PDF text extraction
- **python-docx**: DOCX file processing
- **phonenumbers**: Phone number parsing and validation
- **email-validator**: Email validation
- **uvicorn**: ASGI server for production deployment

### Frontend
- **React**: Component-based UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🔧 Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```

4. Download spaCy model:
   ```bash
   python -m spacy download en_core_web_sm
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```
   The API will be available at `http://localhost:8000`

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Production Build

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend with production server:
   ```bash
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## 📖 Usage

1. **Upload Resume**: Click "Choose File" and select a PDF, DOCX, or TXT resume file
2. **Parse Resume**: Click "Parse & Continue" to extract information from your resume
3. **Enter Job Details**: Provide the job title and full job description
4. **Get Match Score**: Click "Get Match Score" to see your compatibility percentage and matched skills

## 🔌 API Endpoints

### POST /parse-resume
Parses a resume file and returns structured data.

**Request:**
- Content-Type: multipart/form-data
- Body: file (PDF/DOCX/TXT)
### POST /match-resume
Matches a parsed resume against job requirements.

**Request:**
```json
{
  "resume": {
    "contact": {...},
    "skills": [...],
    "experience": [...],
    "education": [...]
  },
  "job_title": "Software Developer",
  "job_description": "We are looking for..."
}
```

**Response:**
```json
{
  "match_score": 85,
  "matched_skills": ["Python", "JavaScript"]
}
```

### GET /
Health check endpoint.

**Response:**
```json
{
  "status": "OK"
}
```

## 🏗 Project Structure

```
resume-parser/
├── backend/
│   ├── main.py          # FastAPI application
│   ├── models.py        # Pydantic models
│   ├── parser.py        # Resume parsing logic
│   └── matcher.py       # Skill matching algorithm
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main React component
│   │   ├── main.jsx     # App entry point
│   │   ├── index.css    # Global styles
│   │   └── pages/       # Page components
│   │       ├── UploadPage.jsx
│   │       ├── JobInputPage.jsx
│   │       └── ResultPage.jsx
│   ├── package.json
│   └── tailwind.config.js
├── requirements.txt     # Python dependencies
└── README.md
```



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **spaCy model not found**: Run `python -m spacy download en_core_web_sm`
2. **CORS errors**: Ensure the backend CORS settings include your frontend URL
3. **File upload fails**: Check file size limits and supported formats
4. **Import errors**: Ensure all dependencies are installed and Python path is correct

### Development Tips

- Use `npm run lint` to check code quality
- Test API endpoints with tools like Postman or curl
- Check browser console for frontend errors
- Monitor backend logs for server-side issues

## 📞 Support

For questions or issues, please open an issue on GitHub.

---
