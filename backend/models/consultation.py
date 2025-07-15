from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class MedicationItem(BaseModel):
    name: str
    dosage: str
    duration: str
    instructions: Optional[str] = None

class ConsultationBase(BaseModel):
    patient_id: str
    doctor_id: str
    symptoms: str
    diagnosis: str
    icd_code: Optional[str] = None
    medications: List[MedicationItem] = []
    notes: Optional[str] = None
    follow_up_required: bool = False
    follow_up_date: Optional[datetime] = None

class ConsultationCreate(ConsultationBase):
    pass

class ConsultationUpdate(BaseModel):
    symptoms: Optional[str] = None
    diagnosis: Optional[str] = None
    icd_code: Optional[str] = None
    medications: Optional[List[MedicationItem]] = None
    notes: Optional[str] = None
    follow_up_required: Optional[bool] = None
    follow_up_date: Optional[datetime] = None

class ConsultationResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    symptoms: str
    diagnosis: str
    icd_code: Optional[str] = None
    medications: List[MedicationItem] = []
    notes: Optional[str] = None
    follow_up_required: bool = False
    follow_up_date: Optional[datetime] = None
    created_at: datetime