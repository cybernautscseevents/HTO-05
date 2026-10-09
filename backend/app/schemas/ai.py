from typing import Optional, List
from pydantic import BaseModel

class WorkExtractionRequest(BaseModel):
    text: str

class WorkExtractionResponse(BaseModel):
    title: str
    trade: str
    skills: List[str]
    quantity: Optional[float] = None
    quantity_unit: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    confidence: float = 0.9
    summary: Optional[str] = None
