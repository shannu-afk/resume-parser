from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from models import ParsedResume
from parser import extract_text_from_file, parse_resume
from models import ParsedResume, MatchRequest, MatchResponse
from matcher import calculate_match_score

app = FastAPI(title="Resume Parser API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/parse-resume", response_model=ParsedResume)
async def parse_resume_endpoint(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pdf', '.docx', '.txt')):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Save uploaded file temporarily
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        text = extract_text_from_file(file_path, file.content_type)
        result = parse_resume(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.get("/")
def health_check():
    return {"status": "OK"}
# main.py (add at the very end)
@app.post("/match-resume", response_model=MatchResponse)
async def match_resume(request: MatchRequest):
    # Pass job_title and job_description separately (as expected by the function)
    score, matched = calculate_match_score(
        resume_skills=request.resume.skills,
        job_title=request.job_title,
        job_description=request.job_description
    )
    return MatchResponse(match_score=score, matched_skills=matched)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)