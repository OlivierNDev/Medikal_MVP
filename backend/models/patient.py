from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PatientBase(BaseModel):
    full_name: str
    phone: str
    national_id: str
    mutual_assistance_no: Optional[str] = None
    date_of_birth: str
    gender: str
    emergency_contact: str
    language_preference: str = "en"

class PatientCreate(PatientBase):
    user_id: str

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    language_preference: Optional[str] = None

class PatientResponse(BaseModel):
    id: str
    full_name: str
    phone: str
    national_id: str
    date_of_birth: str
    gender: str
    created_at: datetime
    mutual_assistance_no: Optional[str] = None
    language_preference: str = "en"