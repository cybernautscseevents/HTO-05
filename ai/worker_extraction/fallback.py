import re
from typing import Optional, List, Dict, Any, Union
from .models import WorkerProfileExtraction, WorkerClaim

# Multilingual number mappings
WORD_TO_NUM: Dict[str, float] = {
    "one": 1.0, "two": 2.0, "three": 3.0, "four": 4.0, "five": 5.0,
    "six": 6.0, "seven": 7.0, "eight": 8.0, "nine": 9.0, "ten": 10.0,
    "eleven": 11.0, "twelve": 12.0, "fifteen": 15.0, "twenty": 20.0,
    # Hindi / Hinglish numerals
    "ek": 1.0, "do": 2.0, "teen": 3.0, "char": 4.0, "chaar": 4.0,
    "paanch": 5.0, "panch": 5.0, "chhe": 6.0, "saat": 7.0, "aath": 8.0,
    "nau": 9.0, "das": 10.0, "dus": 10.0, "gyarah": 11.0, "barah": 12.0,
    "एक": 1.0, "दो": 2.0, "तीन": 3.0, "चार": 4.0, "पाँच": 5.0, "पांच": 5.0,
    "छह": 6.0, "सात": 7.0, "आठ": 8.0, "नौ": 9.0, "दस": 10.0, "बारह": 12.0
}

# Trade / Occupation keywords
OCCUPATION_MAP = [
    (["electrician", "bijli", "बिजली", "इलेक्ट्रीशियन", "wireman"], "electrician"),
    (["plumber", "प्लंबर", "नल मिस्त्री", "nal mistri", "pipe fitter", "plumbing", "नलसाज", "नल"], "plumber"),
    (["carpenter", "बढ़ई", "badhai", "woodwork", "कार्पेंटर"], "carpenter"),
    (["welder", "वेल्डर", "welding"], "welder"),
    (["painter", "पेंटर", "rang mistri"], "painter"),
    (["mason", "राजमिस्त्री", "raj mistri"], "mason"),
    (["mechanic", "मैकेनिक", "auto mechanic", "motor mechanic"], "mechanic")
]

# Skill keywords
SKILL_MAP = [
    (["house wiring", "घर की वायरिंग", "house wire"], "house wiring"),
    (["panel wiring", "panel installation", "पैनल वायरिंग"], "panel wiring"),
    (["motor repair", "मोटर रिपेयर", "motor maintenance"], "motor repair"),
    (["pipe fitting", "पाइप फिटिंग", "pipe fit", "नल फिटिंग"], "pipe fitting"),
    (["bathroom plumbing", "बाथरूम प्लंबिंग", "bathroom maintenance", "bathroom fitting", "बाथरूम"], "bathroom plumbing"),
    (["sanitary", "सैनिटरी", "sanitary fitting", "सैनिटरी फिटिंग"], "sanitary installation"),
    (["drainage", "drain cleaning", "ड्रेनेज"], "drainage"),
    (["leakage repair", "लीकेज", "वाटर लीकेज"], "leakage repair"),
    (["maintenance", "रखरखाव", "servicing"], "maintenance"),
    (["welding", "आर्क वेल्डिंग"], "welding"),
    (["tile fixing", "टाइल्स"], "tile fixing")
]

# Common Indian cities / locations
LOCATIONS = [
    "mangalore", "mangaluru", "delhi", "mumbai", "bombay", "bangalore", "bengaluru",
    "pune", "hyderabad", "chennai", "kolkata", "calcutta", "ahmedabad", "jaipur",
    "lucknow", "chandigarh", "bhopal", "patna", "kochi", "cochin",
    "दिल्ली", "मुंबई", "बैंगलोर", "बेंगलुरु", "मंगलौर", "मंगलोर", "पुणे", "हैदराबाद"
]

LOCATION_DISPLAY_MAP = {
    "mangaluru": "Mangaluru",
    "mangalore": "Mangaluru",
    "मंगलौर": "Mangaluru",
    "मंगलोर": "Mangaluru",
    "delhi": "Delhi",
    "दिल्ली": "Delhi",
    "mumbai": "Mumbai",
    "bombay": "Mumbai",
    "मुंबई": "Mumbai",
    "bangalore": "Bengaluru",
    "bengaluru": "Bengaluru",
    "बैंगलोर": "Bengaluru",
    "बेंगलुरु": "Bengaluru",
    "pune": "Pune",
    "पुणे": "Pune",
    "hyderabad": "Hyderabad",
    "हैदराबाद": "Hyderabad",
    "chennai": "Chennai",
    "चेन्नई": "Chennai",
    "kolkata": "Kolkata",
    "calcutta": "Kolkata",
    "कोलकाता": "Kolkata",
    "kochi": "Kochi",
    "cochin": "Kochi",
    "कोच्चि": "Kochi"
}

KNOWN_LANGUAGES = [
    "Kannada", "Hindi", "English", "Tamil", "Telugu",
    "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Odia", "Urdu"
]

VAGUE_PATTERNS = [
    r"\bmany years\b", r"\bseveral years\b", r"\ba long time\b",
    r"\bbahut saal\b", r"\bkaafi saal\b", r"\bबहुत साल\b", r"\bकाफी साल\b"
]


def extract_claims_fallback(text: str) -> WorkerProfileExtraction:
    """
    Deterministic multilingual fallback extraction for English, Hindi, and Hinglish.
    Strictly adheres to:
    - Never invent facts.
    - Treat vague statements as null years.
    - Only record worker statements as claims.
    """
    if not text or not text.strip():
        return WorkerProfileExtraction()

    text_clean = text.strip()
    text_lower = text_clean.lower()

    # 1. Occupation
    occupation: Optional[str] = None
    for keywords, occ_name in OCCUPATION_MAP:
        if any(kw in text_lower for kw in keywords):
            occupation = occ_name
            break

    # 2. Experience years claimed
    experience_years: Optional[Union[int, float]] = None
    
    # Check if vague experience is used
    is_vague = any(re.search(pat, text_lower) for pat in VAGUE_PATTERNS)
    
    if not is_vague:
        # Search for digit + (year/years/saal/साल/varsh)
        digit_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:years?|yrs?|saal|साल|वर्ष|varsh)\b', text_lower, re.IGNORECASE)
        if digit_match:
            try:
                val = float(digit_match.group(1))
                experience_years = int(val) if val.is_integer() else val
            except ValueError:
                pass
        else:
            # Search for word + (year/years/saal/साल/वर्ष)
            for word, num_val in WORD_TO_NUM.items():
                pattern = rf'\b{word}\s*(?:years?|yrs?|saal|साल|वर्ष|varsh)\b'
                if re.search(pattern, text_lower, re.IGNORECASE):
                    experience_years = int(num_val) if num_val.is_integer() else num_val
                    break

    # 3. Skills
    skills: List[str] = []
    for keywords, skill_name in SKILL_MAP:
        if any(kw in text_lower for kw in keywords):
            if skill_name not in skills:
                skills.append(skill_name)

    # 4. Location
    location: Optional[str] = None
    for loc in LOCATIONS:
        if loc in text_lower:
            location = LOCATION_DISPLAY_MAP.get(loc, loc.capitalize())
            break

    # 5. Languages (Strict Anti-Hallucination: only extract when explicitly stated)
    languages: List[str] = []
    lang_triggers = [
        "speak", "speaks", "fluent", "language", "languages",
        "bolta", "bolti", "aati hai", "aata hai", "baat kar", "malum", "jaan", "bhasha", "boli"
    ]
    has_lang_claim = any(trig in text_lower for trig in lang_triggers)
    if has_lang_claim:
        for lang in KNOWN_LANGUAGES:
            if re.search(rf"\b{lang}\b", text_clean, re.IGNORECASE):
                if lang not in languages:
                    languages.append(lang)

    # 6. Employers
    employers: List[str] = []
    # Pattern: with <Company> or ke sath <Company>
    emp_patterns = [
        r'(?:with|at)\s+([A-Z][A-Za-z0-9\s&]+(?:Contractors?|Enterprises?|Electricals?|Builders?|Constructions?|Pvt Ltd|Ltd))',
        r'([A-Z][A-Za-z0-9\s&]+(?:Contractors?|Enterprises?|Electricals?|Builders?|Constructions?))\s+ke\s+saath'
    ]
    for emp_pat in emp_patterns:
        match = re.search(emp_pat, text_clean)
        if match:
            found = match.group(1).strip()
            if found and found not in employers:
                employers.append(found)

    # 7. Build Claims array explicitly labeled with source: worker_statement
    claims: List[WorkerClaim] = []
    if occupation:
        claims.append(WorkerClaim(field="occupation", value=occupation, source="worker_statement"))
    if experience_years is not None:
        claims.append(WorkerClaim(field="experience_years_claimed", value=experience_years, source="worker_statement"))
    if skills:
        claims.append(WorkerClaim(field="skills", value=skills, source="worker_statement"))
    if location:
        claims.append(WorkerClaim(field="location", value=location, source="worker_statement"))
    if languages:
        claims.append(WorkerClaim(field="languages", value=languages, source="worker_statement"))
    if employers:
        claims.append(WorkerClaim(field="employers", value=employers, source="worker_statement"))

    return WorkerProfileExtraction(
        occupation=occupation,
        experience_years_claimed=experience_years,
        skills=skills,
        location=location,
        languages=languages,
        employers=employers,
        claims=claims
    )
