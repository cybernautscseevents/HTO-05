@echo off
echo ========================================================
echo   VOUCH - Skilled Worker Portable Identity Platform
echo   Starting Development Environment...
echo ========================================================
echo.

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "VOUCH Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Vite Frontend on http://localhost:5173 ...
start "VOUCH Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both services launched in independent background windows.
echo - Backend API:  http://127.0.0.1:8000/api
echo - API Health:   http://127.0.0.1:8000/api/health
echo - Frontend Web: http://localhost:5173
echo.
