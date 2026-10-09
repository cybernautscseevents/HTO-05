"""
Worker Profile Extractor Service Bridge
----------------------------------------
Allows backend routes and services to call the isolated ai.worker_extraction module
without tight coupling or architectural changes.
"""

import sys
from pathlib import Path

# Ensure project root is in sys.path so 'ai' package is importable from backend context
ROOT_DIR = Path(__file__).resolve().parents[3]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

try:
    from ai.worker_extraction import (
        WorkerProfileExtraction,
        WorkerClaim,
        extract_worker_profile,
        extractWorkerProfile,
    )
except ImportError:
    # Fallback if imported from another path configuration
    from ai.worker_extraction.extractor import extract_worker_profile, extractWorkerProfile
    from ai.worker_extraction.models import WorkerProfileExtraction, WorkerClaim

__all__ = [
    "WorkerProfileExtraction",
    "WorkerClaim",
    "extract_worker_profile",
    "extractWorkerProfile",
]
