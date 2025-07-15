from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uvicorn

# Load environment variables
load_dotenv()

# FastAPI app
app = FastAPI(title="Medikal API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/medikal")
client = AsyncIOMotorClient(MONGO_URL)
db = client.medikal

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "patient"  # patient, doctor, admin

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PatientCreate(BaseModel):
    full_name: str
    phone: str
    national_id: str
    mutual_assistance_no: Optional[str] = None
    date_of_birth: str
    gender: str
    emergency_contact: str
    user_id: str

class PatientResponse(BaseModel):
    id: str
    full_name: str
    phone: str
    national_id: str
    date_of_birth: str
    gender: str
    created_at: datetime

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.get("/")
async def root():
    return {"message": "Medikal API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Authentication routes
@app.post("/api/auth/register", response_model=dict)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    existing_email = await db.users.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "role": user.role,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    
    result = await db.users.insert_one(user_doc)
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}

@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "username": current_user["username"],
        "email": current_user["email"],
        "role": current_user["role"],
        "created_at": current_user["created_at"]
    }

# Patient routes
@app.post("/api/patients", response_model=dict)
async def create_patient(patient: PatientCreate, current_user: dict = Depends(get_current_user)):
    # Check if patient with same national_id exists
    existing_patient = await db.patients.find_one({"national_id": patient.national_id})
    if existing_patient:
        raise HTTPException(status_code=400, detail="Patient with this National ID already exists")
    
    # Create patient document
    patient_doc = {
        "full_name": patient.full_name,
        "phone": patient.phone,
        "national_id": patient.national_id,
        "mutual_assistance_no": patient.mutual_assistance_no,
        "date_of_birth": patient.date_of_birth,
        "gender": patient.gender,
        "emergency_contact": patient.emergency_contact,
        "user_id": patient.user_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.patients.insert_one(patient_doc)
    return {"message": "Patient created successfully", "patient_id": str(result.inserted_id)}

@app.get("/api/patients", response_model=List[PatientResponse])
async def get_patients(current_user: dict = Depends(get_current_user)):
    patients = []
    async for patient in db.patients.find():
        patients.append(PatientResponse(
            id=str(patient["_id"]),
            full_name=patient["full_name"],
            phone=patient["phone"],
            national_id=patient["national_id"],
            date_of_birth=patient["date_of_birth"],
            gender=patient["gender"],
            created_at=patient["created_at"]
        ))
    return patients

@app.get("/api/patients/{patient_id}")
async def get_patient(patient_id: str, current_user: dict = Depends(get_current_user)):
    from bson import ObjectId
    
    try:
        patient = await db.patients.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        return {
            "id": str(patient["_id"]),
            "full_name": patient["full_name"],
            "phone": patient["phone"],
            "national_id": patient["national_id"],
            "mutual_assistance_no": patient.get("mutual_assistance_no"),
            "date_of_birth": patient["date_of_birth"],
            "gender": patient["gender"],
            "emergency_contact": patient["emergency_contact"],
            "created_at": patient["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid patient ID")

@app.get("/api/patients/search/{query}")
async def search_patients(query: str, current_user: dict = Depends(get_current_user)):
    # Search by name, phone, or national_id
    patients = []
    search_filter = {
        "$or": [
            {"full_name": {"$regex": query, "$options": "i"}},
            {"phone": {"$regex": query, "$options": "i"}},
            {"national_id": {"$regex": query, "$options": "i"}}
        ]
    }
    
    async for patient in db.patients.find(search_filter):
        patients.append({
            "id": str(patient["_id"]),
            "full_name": patient["full_name"],
            "phone": patient["phone"],
            "national_id": patient["national_id"],
            "date_of_birth": patient["date_of_birth"],
            "gender": patient["gender"],
            "created_at": patient["created_at"]
        })
    
    return patients

# Include routers
from routes.consultation import router as consultation_router
from routes.ai import router as ai_router

app.include_router(consultation_router)
app.include_router(ai_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)