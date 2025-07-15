from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime
from bson import ObjectId
from models.consultation import ConsultationCreate, ConsultationResponse, ConsultationUpdate, MedicationItem
from server import db, get_current_user

router = APIRouter(prefix="/api/consultations", tags=["consultations"])

@router.post("/", response_model=dict)
async def create_consultation(
    consultation: ConsultationCreate,
    current_user: dict = Depends(get_current_user)
):
    # Verify patient exists
    try:
        patient = await db.patients.find_one({"_id": ObjectId(consultation.patient_id)})
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid patient ID")
    
    # Create consultation document
    consultation_doc = {
        "patient_id": consultation.patient_id,
        "doctor_id": consultation.doctor_id,
        "symptoms": consultation.symptoms,
        "diagnosis": consultation.diagnosis,
        "icd_code": consultation.icd_code,
        "medications": [med.dict() for med in consultation.medications],
        "notes": consultation.notes,
        "follow_up_required": consultation.follow_up_required,
        "follow_up_date": consultation.follow_up_date,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.consultations.insert_one(consultation_doc)
    
    # Update patient's last consultation
    await db.patients.update_one(
        {"_id": ObjectId(consultation.patient_id)},
        {"$set": {"last_consultation": datetime.utcnow()}}
    )
    
    return {"message": "Consultation created successfully", "consultation_id": str(result.inserted_id)}

@router.get("/patient/{patient_id}", response_model=List[ConsultationResponse])
async def get_patient_consultations(
    patient_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        consultations = []
        async for consultation in db.consultations.find({"patient_id": patient_id}).sort("created_at", -1):
            consultations.append(ConsultationResponse(
                id=str(consultation["_id"]),
                patient_id=consultation["patient_id"],
                doctor_id=consultation["doctor_id"],
                symptoms=consultation["symptoms"],
                diagnosis=consultation["diagnosis"],
                icd_code=consultation.get("icd_code"),
                medications=[MedicationItem(**med) for med in consultation.get("medications", [])],
                notes=consultation.get("notes"),
                follow_up_required=consultation.get("follow_up_required", False),
                follow_up_date=consultation.get("follow_up_date"),
                created_at=consultation["created_at"]
            ))
        return consultations
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error retrieving consultations: {str(e)}")

@router.get("/{consultation_id}", response_model=ConsultationResponse)
async def get_consultation(
    consultation_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        consultation = await db.consultations.find_one({"_id": ObjectId(consultation_id)})
        if not consultation:
            raise HTTPException(status_code=404, detail="Consultation not found")
        
        return ConsultationResponse(
            id=str(consultation["_id"]),
            patient_id=consultation["patient_id"],
            doctor_id=consultation["doctor_id"],
            symptoms=consultation["symptoms"],
            diagnosis=consultation["diagnosis"],
            icd_code=consultation.get("icd_code"),
            medications=[MedicationItem(**med) for med in consultation.get("medications", [])],
            notes=consultation.get("notes"),
            follow_up_required=consultation.get("follow_up_required", False),
            follow_up_date=consultation.get("follow_up_date"),
            created_at=consultation["created_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid consultation ID")

@router.put("/{consultation_id}", response_model=dict)
async def update_consultation(
    consultation_id: str,
    consultation_update: ConsultationUpdate,
    current_user: dict = Depends(get_current_user)
):
    try:
        update_data = {k: v for k, v in consultation_update.dict().items() if v is not None}
        if "medications" in update_data:
            update_data["medications"] = [med.dict() for med in update_data["medications"]]
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.consultations.update_one(
            {"_id": ObjectId(consultation_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Consultation not found")
        
        return {"message": "Consultation updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating consultation: {str(e)}")

@router.delete("/{consultation_id}")
async def delete_consultation(
    consultation_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        result = await db.consultations.delete_one({"_id": ObjectId(consultation_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Consultation not found")
        
        return {"message": "Consultation deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid consultation ID")

@router.get("/doctor/{doctor_id}", response_model=List[ConsultationResponse])
async def get_doctor_consultations(
    doctor_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        consultations = []
        async for consultation in db.consultations.find({"doctor_id": doctor_id}).sort("created_at", -1):
            consultations.append(ConsultationResponse(
                id=str(consultation["_id"]),
                patient_id=consultation["patient_id"],
                doctor_id=consultation["doctor_id"],
                symptoms=consultation["symptoms"],
                diagnosis=consultation["diagnosis"],
                icd_code=consultation.get("icd_code"),
                medications=[MedicationItem(**med) for med in consultation.get("medications", [])],
                notes=consultation.get("notes"),
                follow_up_required=consultation.get("follow_up_required", False),
                follow_up_date=consultation.get("follow_up_date"),
                created_at=consultation["created_at"]
            ))
        return consultations
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error retrieving consultations: {str(e)}")