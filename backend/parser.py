import re
from unicodedata import name
import pdfplumber
from docx import Document
import spacy
from dateutil import parser as date_parser
import phonenumbers
from email_validator import validate_email, EmailNotValidError
from phonenumbers import NumberParseException
from models import ParsedResume, ContactInfo
from matcher import extract_skills_from_text, canonical_to_display
# Load spaCy model (lightweight)
nlp = spacy.load("en_core_web_sm")

def extract_text_from_file(file_path: str, file_type: str) -> str:
    if file_type == "application/pdf":
        with pdfplumber.open(file_path) as pdf:
            return "\n".join([page.extract_text() or "" for page in pdf.pages])
    elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    else:  # .txt
        with open(file_path, "r") as f:
            return f.read()

def extract_email(text: str) -> str:
    emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    return emails[0] if emails else None

def extract_phone(text: str) -> str:
    # Common regions to try (add more if needed)
    regions = ["IN", "US", "GB"]  # IN = India, US = United States, GB = UK
    
    # Extract all digit sequences that might be phones (min 7 digits)
    for match in phonenumbers.PhoneNumberMatcher(text, "IN"):  # Default to India
        # Format in E.164 (standard international format)
        return phonenumbers.format_number(match.number, phonenumbers.PhoneNumberFormat.E164)
    
    # Fallback: try parsing raw numbers if matcher fails
    for region in regions:
        for token in text.split():
            # Clean token: keep only digits and +
            cleaned = ''.join(ch for ch in token if ch.isdigit() or ch == '+')
            if len(cleaned.replace('+', '')) < 7:
                continue
            try:
                num = phonenumbers.parse(cleaned, region)
                if phonenumbers.is_valid_number(num):
                    return phonenumbers.format_number(num, phonenumbers.PhoneNumberFormat.E164)
            except NumberParseException:
                continue
    return None

def extract_skills(text: str) -> list:
    # Use shared matcher to keep skills consistent across parser/matcher
    canon = extract_skills_from_text(text)
    return [canonical_to_display(c) for c in sorted(canon)]

def extract_name(text: str) -> str:
    # Heuristic: First line with 2+ capitalized words
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    for line in lines[:3]:  # Check top 3 lines
        words = line.split()
        if len(words) >= 2 and all(w[0].isupper() for w in words if w.isalpha()):
            return line
    return None

def parse_resume(text: str) -> ParsedResume:
    # Contact
    email = extract_email(text)
    phone = extract_phone(text)
    name = extract_name(text)

    # Skills
    skills = extract_skills(text)

    # Simple experience/education (MVP: return raw sections)
    # In production: use NER or section splitting
    experience = []
    education = []

    # In parser.py → parse_resume()
    return ParsedResume(
        contact=ContactInfo(name=name, email=email, phone=phone),
        skills=skills,
        experience=experience,
        education=education
    )
