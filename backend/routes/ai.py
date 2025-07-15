from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from server import db, get_current_user
import base64
import io
from PIL import Image
import json

router = APIRouter(prefix="/api/ai", tags=["ai"])

class DiagnosisRequest(BaseModel):
    symptoms: str
    patient_id: str
    medical_history: List[str] = []

class DiagnosisResponse(BaseModel):
    suggestions: List[Dict[str, Any]]
    medications: List[Dict[str, Any]]
    confidence: float
    warnings: List[str] = []

class ChatMessage(BaseModel):
    message: str
    session_id: str
    language: str = "en"

class ChatResponse(BaseModel):
    response: str
    session_id: str
    confidence: float

class SkinAnalysisResponse(BaseModel):
    predictions: List[Dict[str, Any]]
    confidence: float
    recommendation: str

@router.post("/diagnosis", response_model=DiagnosisResponse)
async def get_diagnosis_suggestions(
    request: DiagnosisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    AI-powered diagnosis suggestions based on symptoms
    """
    try:
        # Simple rule-based diagnosis for demo
        symptoms_lower = request.symptoms.lower()
        suggestions = []
        medications = []
        warnings = []
        
        # Fever + Cough symptoms
        if "fever" in symptoms_lower and "cough" in symptoms_lower:
            suggestions = [
                {"condition": "Upper Respiratory Infection", "icd_code": "J06.9", "probability": 0.85},
                {"condition": "Bacterial Pneumonia", "icd_code": "J15.9", "probability": 0.10},
                {"condition": "Influenza", "icd_code": "J11.1", "probability": 0.05}
            ]
            medications = [
                {"name": "Amoxicillin", "dosage": "500mg", "frequency": "3 times daily", "duration": "7 days"},
                {"name": "Paracetamol", "dosage": "500mg", "frequency": "as needed", "duration": "for fever"}
            ]
            
        # Headache symptoms
        elif "headache" in symptoms_lower:
            suggestions = [
                {"condition": "Tension Headache", "icd_code": "G44.2", "probability": 0.70},
                {"condition": "Migraine", "icd_code": "G43.9", "probability": 0.20},
                {"condition": "Sinus Headache", "icd_code": "G44.82", "probability": 0.10}
            ]
            medications = [
                {"name": "Ibuprofen", "dosage": "400mg", "frequency": "every 6 hours", "duration": "as needed"},
                {"name": "Paracetamol", "dosage": "1000mg", "frequency": "every 6 hours", "duration": "as needed"}
            ]
            
        # Stomach pain
        elif "stomach" in symptoms_lower or "abdominal" in symptoms_lower:
            suggestions = [
                {"condition": "Gastritis", "icd_code": "K29.7", "probability": 0.60},
                {"condition": "Peptic Ulcer", "icd_code": "K27.9", "probability": 0.25},
                {"condition": "Gastroenteritis", "icd_code": "K52.9", "probability": 0.15}
            ]
            medications = [
                {"name": "Omeprazole", "dosage": "20mg", "frequency": "once daily", "duration": "14 days"},
                {"name": "Antacid", "dosage": "10ml", "frequency": "as needed", "duration": "for symptoms"}
            ]
            
        else:
            suggestions = [
                {"condition": "General Symptoms", "icd_code": "R68.89", "probability": 0.50}
            ]
            medications = [
                {"name": "Symptomatic Treatment", "dosage": "as appropriate", "frequency": "as needed", "duration": "as needed"}
            ]
        
        # Check for AMR warnings
        if any(med["name"] in ["Amoxicillin", "Ciprofloxacin", "Azithromycin"] for med in medications):
            # Check patient's antibiotic history
            patient_consultations = await db.consultations.find({"patient_id": request.patient_id}).to_list(length=10)
            antibiotic_count = 0
            for consultation in patient_consultations:
                for med in consultation.get("medications", []):
                    if med.get("name") in ["Amoxicillin", "Ciprofloxacin", "Azithromycin"]:
                        antibiotic_count += 1
            
            if antibiotic_count >= 3:
                warnings.append("Patient has received multiple antibiotic courses recently. Consider culture test.")
        
        return DiagnosisResponse(
            suggestions=suggestions,
            medications=medications,
            confidence=0.85,
            warnings=warnings
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing diagnosis: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    current_user: dict = Depends(get_current_user)
):
    """
    Chat with AI assistant
    """
    try:
        # Store chat message
        chat_doc = {
            "user_id": str(current_user["_id"]),
            "session_id": message.session_id,
            "message": message.message,
            "language": message.language,
            "timestamp": datetime.utcnow()
        }
        await db.chat_messages.insert_one(chat_doc)
        
        # Generate response based on message content
        message_lower = message.message.lower()
        
        if "drug interaction" in message_lower or "medication" in message_lower:
            response = """I can help you check for drug interactions. Please provide the specific medications you'd like me to analyze. I'll check for:

• Contraindications
• Dosage conflicts  
• Side effect interactions
• Alternative medications

Please list the medications separated by commas."""
            
        elif "diabetes" in message_lower:
            response = """For diabetes management, current guidelines recommend:

• **HbA1c target**: <7% for most adults
• **Blood pressure**: <140/90 mmHg  
• **Lifestyle modifications**: Diet and exercise
• **Medication**: Metformin as first-line therapy

Would you like more specific information about any of these areas?"""
            
        elif "hypertension" in message_lower:
            response = """For hypertension management:

• **Target BP**: <140/90 mmHg for most adults
• **Lifestyle**: Low sodium diet, regular exercise
• **First-line medications**: ACE inhibitors, ARBs, thiazide diuretics
• **Monitoring**: Regular BP checks and medication adjustments

Need specific medication recommendations?"""
            
        elif "fever" in message_lower or "temperature" in message_lower:
            response = """For fever management:

• **Adults**: Paracetamol 500-1000mg every 4-6 hours (max 4g/day)
• **Children**: Paracetamol 10-15mg/kg every 4-6 hours
• **Alternative**: Ibuprofen 400mg every 6-8 hours
• **Non-medication**: Cool baths, adequate hydration

Monitor for warning signs: difficulty breathing, severe headache, persistent vomiting."""
            
        else:
            response = f"""I'm here to help with medical questions. Based on your message, I can provide guidance on:

• Diagnostic considerations
• Treatment protocols
• Drug interactions
• Patient care guidelines

For "{message.message}", would you like me to provide more specific information about any particular aspect?"""
        
        # Store AI response
        response_doc = {
            "user_id": str(current_user["_id"]),
            "session_id": message.session_id,
            "response": response,
            "language": message.language,
            "timestamp": datetime.utcnow()
        }
        await db.ai_responses.insert_one(response_doc)
        
        return ChatResponse(
            response=response,
            session_id=message.session_id,
            confidence=0.90
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@router.post("/skin-analysis", response_model=SkinAnalysisResponse)
async def analyze_skin_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze skin image for disease detection
    """
    try:
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to base64 for storage
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        image_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Mock AI analysis (in real implementation, this would call a trained model)
        predictions = [
            {"condition": "Eczema", "probability": 0.85, "severity": "mild"},
            {"condition": "Dermatitis", "probability": 0.12, "severity": "mild"},
            {"condition": "Normal skin", "probability": 0.03, "severity": "none"}
        ]
        
        recommendation = """Based on the analysis, this appears to be eczema with mild severity. 

**Recommendations:**
• Apply moisturizer regularly
• Use mild, fragrance-free soap
• Avoid known triggers
• Consider topical corticosteroid if symptoms persist

**When to see a doctor:**
• Symptoms worsen or don't improve in 1-2 weeks
• Signs of infection (pus, increased redness, warmth)
• Severe itching affecting sleep"""
        
        # Store analysis result
        analysis_doc = {
            "user_id": str(current_user["_id"]),
            "image_base64": image_base64,
            "predictions": predictions,
            "confidence": 0.85,
            "recommendation": recommendation,
            "timestamp": datetime.utcnow()
        }
        await db.skin_analyses.insert_one(analysis_doc)
        
        return SkinAnalysisResponse(
            predictions=predictions,
            confidence=0.85,
            recommendation=recommendation
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")

@router.get("/chat/history/{session_id}")
async def get_chat_history(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get chat history for a session
    """
    try:
        messages = []
        
        # Get user messages
        async for msg in db.chat_messages.find({"session_id": session_id}).sort("timestamp", 1):
            messages.append({
                "type": "user",
                "message": msg["message"],
                "timestamp": msg["timestamp"]
            })
        
        # Get AI responses
        async for resp in db.ai_responses.find({"session_id": session_id}).sort("timestamp", 1):
            messages.append({
                "type": "ai",
                "message": resp["response"],
                "timestamp": resp["timestamp"]
            })
        
        # Sort by timestamp
        messages.sort(key=lambda x: x["timestamp"])
        
        return {"messages": messages}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving chat history: {str(e)}")

@router.get("/amr/risk/{patient_id}")
async def get_amr_risk(
    patient_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get AMR risk assessment for a patient
    """
    try:
        # Get patient's consultation history
        consultations = await db.consultations.find({"patient_id": patient_id}).to_list(length=50)
        
        antibiotic_courses = []
        for consultation in consultations:
            for med in consultation.get("medications", []):
                if med.get("name") in ["Amoxicillin", "Ciprofloxacin", "Azithromycin", "Ceftriaxone", "Doxycycline"]:
                    antibiotic_courses.append({
                        "antibiotic": med["name"],
                        "date": consultation["created_at"],
                        "duration": med.get("duration", "unknown")
                    })
        
        # Calculate risk score
        risk_score = min(len(antibiotic_courses) * 15, 100)
        
        risk_level = "Low"
        if risk_score >= 50:
            risk_level = "High"
        elif risk_score >= 30:
            risk_level = "Medium"
        
        return {
            "patient_id": patient_id,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "antibiotic_courses": antibiotic_courses,
            "recommendations": [
                "Consider culture and sensitivity testing before prescribing antibiotics",
                "Use narrow-spectrum antibiotics when possible",
                "Ensure appropriate duration of treatment",
                "Monitor for resistance patterns"
            ] if risk_score >= 30 else ["Continue standard antibiotic stewardship practices"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating AMR risk: {str(e)}")