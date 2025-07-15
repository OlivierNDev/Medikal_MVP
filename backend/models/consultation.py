from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

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

class ConsultationInDB(ConsultationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

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