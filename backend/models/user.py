from pydantic import BaseModel, EmailStr, Field
from typing import Optional
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

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str = "patient"  # patient, doctor, admin
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None

class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    password: str
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None