# VOUCH Backend Service

FastAPI backend with Firebase Firestore integration, deterministic Evidence Engine, and AI extraction service.

## 🚀 Running the Server

```powershell
# 1. Navigate to backend directory
cd backend

# 2. Activate virtual environment
.\venv\Scripts\activate

# 3. Start development server
uvicorn app.main:app --reload --port 5000
```

The interactive Swagger documentation will be available at:
👉 **http://localhost:5000/docs**

## 📂 Architecture

- `app/api/`: REST route controllers (`workers`, `work`, `confirmations`, `passport`, `ai`)
- `app/core/`: Configuration & Firebase Admin client
- `app/schemas/`: Pydantic input/output contract models
- `app/services/`: Core logic:
  - `data_service.py`: Firestore CRUD & demo seed data
  - `evidence_engine.py`: Deterministic 0–100% Evidence Confidence algorithm
  - `ai_service.py`: Gemini & heuristic work extractor
