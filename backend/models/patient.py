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

class PatientInDB(PatientBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

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