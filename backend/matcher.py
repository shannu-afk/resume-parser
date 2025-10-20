# matcher.py (enhanced accuracy)
import re
from typing import Set, List, Tuple, Dict

# Canonical skills and their aliases (lowercase)
SKILL_ALIASES: Dict[str, List[str]] = {
    # Languages
    "python": ["python"],
    "javascript": ["javascript", "js"],
    "typescript": ["typescript", "ts"],
    "java": ["java"],
    "c++": ["c++"],
    "c#": ["c#", ".net", "dotnet"],
    "go": ["go", "golang"],
    "rust": ["rust"],
    "php": ["php"],
    "ruby": ["ruby", "ruby on rails", "rails"],
    "swift": ["swift"],
    "kotlin": ["kotlin"],

    # Web
    "react": ["react", "react.js", "reactjs"],
    "vue": ["vue", "vue.js", "vuejs"],
    "angular": ["angular"],
    "node.js": ["node.js", "node", "nodejs"],
    "express": ["express", "express.js"],
    "django": ["django"],
    "flask": ["flask"],
    "fastapi": ["fastapi"],

    # Databases
    "sql": ["sql"],
    "postgresql": ["postgresql", "postgres", "postgreSQL".lower()],
    "mysql": ["mysql"],
    "sqlite": ["sqlite"],
    "mongodb": ["mongodb", "mongo"],
    "redis": ["redis"],
    "oracle": ["oracle"],
    "dynamodb": ["dynamodb"],

    # DevOps & Cloud
    "docker": ["docker"],
    "kubernetes": ["kubernetes", "k8s"],
    "aws": ["aws", "amazon web services"],
    "azure": ["azure", "microsoft azure"],
    "gcp": ["gcp", "google cloud", "google cloud platform"],
    "terraform": ["terraform"],
    "jenkins": ["jenkins"],
    "git": ["git", "github", "gitlab", "bitbucket"],
    "ci/cd": ["ci/cd", "cicd", "continuous integration", "continuous delivery", "continuous deployment"],
    "linux": ["linux", "ubuntu", "debian", "centos"],
    "bash": ["bash", "shell", "shell scripting"],
    "nginx": ["nginx"],
    "apache": ["apache", "httpd"],

    # Data & ML
    "machine learning": ["machine learning", "ml"],
    "deep learning": ["deep learning", "dl"],
    "tensorflow": ["tensorflow"],
    "pytorch": ["pytorch"],
    "scikit-learn": ["scikit-learn", "sklearn"],
    "pandas": ["pandas"],
    "numpy": ["numpy"],
    "data science": ["data science", "data scientist"],
    "nlp": ["nlp", "natural language processing"],
    "computer vision": ["computer vision", "cv"],
    "opencv": ["opencv"],
    "keras": ["keras"],

    # Concepts & Tools
    "rest api": ["rest", "restful", "rest api"],
    "graphql": ["graphql"],
    "microservices": ["microservices", "micro-service", "micro service"],
    "backend": ["backend", "back-end", "back end"],
    "frontend": ["frontend", "front-end", "front end"],
    "full stack": ["full stack", "full-stack"],
    "orm": ["orm", "sequelize", "typeorm", "hibernate", "sqlalchemy"],
    "jwt": ["jwt", "json web token"],
    "oauth": ["oauth", "oauth2", "oauth 2.0"],
    "testing": ["testing", "unit testing", "integration testing", "end to end", "e2e"],
    "pytest": ["pytest"],
    "jest": ["jest"],
    "mocha": ["mocha"],
    "agile": ["agile"],
    "scrum": ["scrum"],
}

DISPLAY_NAME: Dict[str, str] = {
    "c++": "C++",
    "c#": "C#",
    "node.js": "Node.js",
    "postgresql": "PostgreSQL",
    "mongodb": "MongoDB",
    "ci/cd": "CI/CD",
    "nlp": "NLP",
    "rest api": "REST API",
    "aws": "AWS",
    "gcp": "GCP",
    "sql": "SQL",
    "jwt": "JWT",
    "oauth": "OAuth",
}

RE_REQUIRED = re.compile(r"\b(must|required|mandatory|strong|proven|expert|need to|should have)\b", re.I)
RE_PREFERRED = re.compile(r"\b(preferred|nice to have|good to have|plus)\b", re.I)

# Public helpers to share with parser

def canonical_to_display(canon: str) -> str:
    return DISPLAY_NAME.get(canon, canon.title())


def _clean_text(text: str) -> str:
    # Keep alnum and some symbols; normalize whitespace
    t = re.sub(r"[^a-z0-9+#./\s-]", " ", text.lower())
    return re.sub(r"\s+", " ", t).strip()


def _iter_alias_matches(text: str, alias: str):
    pattern = re.compile(rf"(?<![a-z0-9]){re.escape(alias)}(?![a-z0-9])")
    for m in pattern.finditer(text):
        yield m.start(), m.end()


def extract_skills_from_text(text: str) -> Set[str]:
    """Return canonical skill names present in text."""
    t = _clean_text(text)
    found: Set[str] = set()
    for canon, aliases in SKILL_ALIASES.items():
        for alias in aliases:
            for _start, _end in _iter_alias_matches(t, alias):
                found.add(canon)
                break
    return found


def _extract_weighted_job_skills(text: str) -> Dict[str, float]:
    t = _clean_text(text)
    weights: Dict[str, float] = {}
    for canon, aliases in SKILL_ALIASES.items():
        best = 0.0
        for alias in aliases:
            for start, end in _iter_alias_matches(t, alias):
                window = t[max(0, start-50): min(len(t), end+50)]
                w = 1.0
                if RE_REQUIRED.search(window):
                    w = max(w, 1.5)
                if RE_PREFERRED.search(window):
                    w = min(w, 0.8)
                best = max(best, w)
        if best > 0:
            weights[canon] = best
    return weights


def _canonicalize_skill_string(s: str) -> str:
    s_norm = _clean_text(s)
    # Exact canonical match
    if s_norm in SKILL_ALIASES:
        return s_norm
    # Alias lookup
    for canon, aliases in SKILL_ALIASES.items():
        if s_norm == canon:
            return canon
        for alias in aliases:
            if s_norm == alias:
                return canon
    # Try stripping ".js" and similar minor variants
    s_norm = s_norm.replace(".js", " js").strip()
    for canon, aliases in SKILL_ALIASES.items():
        if s_norm == canon or s_norm in aliases:
            return canon
    return s_norm


def calculate_match_score(resume_skills: List[str], job_title: str, job_description: str) -> Tuple[int, List[str]]:
    """Return weighted match score (0-100) and list of matched skills for display."""
    full_job_text = f"{job_title}\n{job_description}"
    job_weights = _extract_weighted_job_skills(full_job_text)
    if not job_weights:
        return 0, []

    resume_canon = {_canonicalize_skill_string(s) for s in resume_skills}
    matched = [canon for canon in job_weights.keys() if canon in resume_canon]

    matched_weight = sum(job_weights[c] for c in matched)
    total_weight = sum(job_weights.values())
    score = int(round((matched_weight / total_weight) * 100)) if total_weight else 0
    score = max(0, min(score, 100))

    # Convert to display names
    matched_display = [canonical_to_display(c) for c in matched]
    return score, matched_display
