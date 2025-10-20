from pydantic import BaseModel
from typing import List, Optional

class ContactInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class ExperienceItem(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    duration: Optional[str] = None

class EducationItem(BaseModel):
    degree: Optional[str] = None
    university: Optional[str] = None
    year: Optional[str] = None

class ParsedResume(BaseModel):
    contact: ContactInfo
    skills: List[str]
    experience: List[ExperienceItem]
    education: List[EducationItem]
# models.py (add at the bottom)

class MatchRequest(BaseModel):
    resume: ParsedResume
    job_title: str
    job_description: str

class MatchResponse(BaseModel):
    match_score: int  # 0–100
    matched_skills: List[str]