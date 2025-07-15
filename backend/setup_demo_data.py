import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime

# Database setup
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/medikal")
client = AsyncIOMotorClient(MONGO_URL)
db = client.medikal

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_demo_users():
    """Create demo users for testing"""
    demo_users = [
        {
            "username": "patient_demo",
            "email": "patient@medikal.rw",
            "password": "demo123",
            "role": "patient"
        },
        {
            "username": "doctor_demo", 
            "email": "doctor@medikal.rw",
            "password": "demo123",
            "role": "doctor"
        },
        {
            "username": "admin_demo",
            "email": "admin@medikal.rw", 
            "password": "demo123",
            "role": "admin"
        },
        {
            "username": "ai_demo",
            "email": "ai@medikal.rw",
            "password": "demo123", 
            "role": "ai"
        }
    ]
    
    for user_data in demo_users:
        # Check if user already exists
        existing_user = await db.users.find_one({"username": user_data["username"]})
        if not existing_user:
            # Hash password
            hashed_password = pwd_context.hash(user_data["password"])
            
            # Create user document
            user_doc = {
                "username": user_data["username"],
                "email": user_data["email"],
                "password": hashed_password,
                "role": user_data["role"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "is_active": True
            }
            
            # Insert user
            result = await db.users.insert_one(user_doc)
            print(f"✅ Created demo user: {user_data['username']} (role: {user_data['role']})")
        else:
            print(f"👤 User already exists: {user_data['username']}")

async def create_demo_patients():
    """Create demo patients for testing"""
    demo_patients = [
        {
            "full_name": "Jean Paul Uwimana",
            "phone": "+250 788 123 456",
            "national_id": "1234567890123456",
            "mutual_assistance_no": "MUT001",
            "date_of_birth": "1990-01-15",
            "gender": "Male",
            "emergency_contact": "Marie Uwimana +250 788 123 457",
            "user_id": "patient_demo",
            "language_preference": "en"
        },
        {
            "full_name": "Marie Mukamana",
            "phone": "+250 788 123 458",
            "national_id": "1234567890123457",
            "mutual_assistance_no": "MUT002",
            "date_of_birth": "1985-03-22",
            "gender": "Female",
            "emergency_contact": "Jean Mukamana +250 788 123 459",
            "user_id": "patient_demo",
            "language_preference": "rw"
        },
        {
            "full_name": "Alexis Niyongabo",
            "phone": "+250 788 123 460",
            "national_id": "1234567890123458",
            "mutual_assistance_no": "MUT003",
            "date_of_birth": "1992-07-08",
            "gender": "Male",
            "emergency_contact": "Grace Niyongabo +250 788 123 461",
            "user_id": "patient_demo",
            "language_preference": "en"
        }
    ]
    
    for patient_data in demo_patients:
        # Check if patient already exists
        existing_patient = await db.patients.find_one({"national_id": patient_data["national_id"]})
        if not existing_patient:
            patient_doc = {
                **patient_data,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await db.patients.insert_one(patient_doc)
            print(f"✅ Created demo patient: {patient_data['full_name']}")
        else:
            print(f"👤 Patient already exists: {patient_data['full_name']}")

async def main():
    print("🔄 Setting up demo data...")
    await create_demo_users()
    await create_demo_patients()
    print("✅ Demo data setup complete!")
    
    # Close the database connection
    client.close()

if __name__ == "__main__":
    asyncio.run(main())