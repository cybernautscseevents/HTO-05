from typing import Optional, List, Any, Union
from pydantic import BaseModel, Field, field_validator


class WorkerClaim(BaseModel):
    """
    Represents an atomic claim stated by the worker.
    Crucial semantic rule: Source is explicitly labeled as worker_statement (never verified/confirmed).
    """
    field: str
    value: Any
    source: str = "worker_statement"


class WorkerProfileExtraction(BaseModel):
    """
    Guaranteed output contract for worker profile extraction.
    Always conforms strictly to:
    {
      "occupation": null,
      "experience_years_claimed": null,
      "skills": [],
      "location": null,
      "employers": [],
      "claims": []
    }
    """
    occupation: Optional[str] = None
    experience_years_claimed: Optional[Union[int, float]] = None
    skills: List[str] = Field(default_factory=list)
    location: Optional[str] = None
    languages: List[str] = Field(default_factory=list)
    employers: List[str] = Field(default_factory=list)
    claims: List[WorkerClaim] = Field(default_factory=list)

    @field_validator("occupation", mode="before")
    @classmethod
    def clean_empty_strings(cls, v: Any) -> Optional[str]:
        if v is None:
            return None
        if isinstance(v, str):
            v_stripped = v.strip()
            return v_stripped if v_stripped else None
        return str(v)

    @field_validator("location", mode="before")
    @classmethod
    def normalize_location(cls, v: Any) -> Optional[str]:
        if v is None:
            return None
        if isinstance(v, str):
            v_stripped = v.strip()
            if not v_stripped:
                return None
            aliases = {
                "bangalore": "Bengaluru",
                "bengaluru": "Bengaluru",
                "बैंगलोर": "Bengaluru",
                "बेंगलुरु": "Bengaluru",
                "mangalore": "Mangaluru",
                "mangaluru": "Mangaluru",
                "मंगलौर": "Mangaluru",
                "मंगलोर": "Mangaluru",
                "bombay": "Mumbai",
                "mumbai": "Mumbai",
                "मुंबई": "Mumbai",
                "calcutta": "Kolkata",
                "kolkata": "Kolkata",
                "कोलकाता": "Kolkata",
                "madras": "Chennai",
                "chennai": "Chennai",
                "चेन्नई": "Chennai",
                "cochin": "Kochi",
                "kochi": "Kochi",
                "कोच्चि": "Kochi",
                "delhi": "Delhi",
                "दिल्ली": "Delhi",
                "pune": "Pune",
                "पुणे": "Pune",
                "hyderabad": "Hyderabad",
                "हैदराबाद": "Hyderabad",
            }
            return aliases.get(v_stripped.lower(), v_stripped.title())
        return str(v)

    @field_validator("experience_years_claimed", mode="before")
    @classmethod
    def validate_years(cls, v: Any) -> Optional[Union[int, float]]:
        if v is None:
            return None
        try:
            num = float(v)
            if num < 0:
                return None
            return int(num) if num.is_integer() else num
        except (ValueError, TypeError):
            return None

    @field_validator("skills", "languages", "employers", mode="before")
    @classmethod
    def ensure_string_list(cls, v: Any) -> List[str]:
        if not v:
            return []
        if isinstance(v, list):
            cleaned = []
            for item in v:
                if item and isinstance(item, str):
                    s = item.strip()
                    if s and s not in cleaned:
                        cleaned.append(s)
            return cleaned
        if isinstance(v, str) and v.strip():
            return [v.strip()]
        return []

    @field_validator("claims", mode="before")
    @classmethod
    def sanitize_claims(cls, v: Any) -> List[Any]:
        if not v or not isinstance(v, list):
            return []
        sanitized = []
        for c in v:
            if isinstance(c, dict):
                # Ensure source cannot be spoofed to verified or confirmed
                source = str(c.get("source", "worker_statement"))
                if any(bad in source.lower() for bad in ["verif", "confirm", "trust", "authent"]):
                    source = "worker_statement"
                sanitized.append({
                    "field": str(c.get("field", "claim")),
                    "value": c.get("value"),
                    "source": source
                })
            elif isinstance(c, WorkerClaim):
                sanitized.append(c)
        return sanitized
