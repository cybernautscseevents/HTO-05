import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.core.firebase import get_db
from app.services.evidence_engine import calculate_work_confidence, calculate_skill_confidence
from app.schemas.worker import PassportCompleteness

logger = logging.getLogger("vouch.data")

# In-memory storage cache / fallback
_MEMORY_STORE = {
    "worker": {
        "id": "ravi_kumar_001",
        "user_id": "user_ravi_001",
        "name": "Ravi Kumar",
        "trade": "Electrical Technician",
        "experience_years": 9,
        "location": "Mangaluru, Karnataka",
        "bio": "Certified electrical technician specializing in commercial power distribution, industrial motor maintenance, and residential rewiring.",
        "profile_photo_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
        "email": "ravi.kumar@vouchwork.in",
        "phone": "+91 98450 71234",
        "languages": ["Kannada", "Hindi", "English"],
        "public_slug": "ravi-kumar-82a7"
    },
    "work_records": [
        {
            "id": "work_001",
            "worker_id": "ravi_kumar_001",
            "title": "Commercial Panel Installation",
            "description": "Installed and verified six 415V distribution boards and main switchgear at Mangalore Trade Center.",
            "date": "2026-10-02",
            "location": "Mangalore Trade Center, Mangaluru",
            "quantity": 6.0,
            "quantity_unit": "panels",
            "trade": "Electrical",
            "skills": ["Panel Installation", "Commercial Electrical"],
            "status": "CONFIRMED",
            "created_at": "2026-10-02T10:30:00Z",
            "evidence": [
                {
                    "id": "ev_001",
                    "work_record_id": "work_001",
                    "type": "PHOTO",
                    "url": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
                    "description": "Main Switchgear and Busbar Alignment",
                    "created_at": "2026-10-02T11:00:00Z"
                },
                {
                    "id": "ev_002",
                    "work_record_id": "work_001",
                    "type": "PHOTO",
                    "url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
                    "description": "Secondary Distribution Breaker Array",
                    "created_at": "2026-10-02T11:15:00Z"
                },
                {
                    "id": "ev_003",
                    "work_record_id": "work_001",
                    "type": "CERTIFICATE",
                    "url": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
                    "description": "Site Safety Compliance Sign-Off",
                    "created_at": "2026-10-02T14:00:00Z"
                }
            ],
            "confirmations": [
                {
                    "id": "conf_001",
                    "work_record_id": "work_001",
                    "verifier_name": "Anil Sharma",
                    "verifier_type": "SUPERVISOR",
                    "status": "CONFIRMED",
                    "token": "tok_demo_anil",
                    "created_at": "2026-10-02T15:00:00Z",
                    "verified_at": "2026-10-03T09:30:00Z"
                },
                {
                    "id": "conf_002",
                    "work_record_id": "work_001",
                    "verifier_name": "Metro Infra Contracting",
                    "verifier_type": "EMPLOYER",
                    "status": "CONFIRMED",
                    "token": "tok_demo_metro",
                    "created_at": "2026-10-02T15:00:00Z",
                    "verified_at": "2026-10-03T11:00:00Z"
                }
            ]
        },
        {
            "id": "work_002",
            "worker_id": "ravi_kumar_001",
            "title": "Residential Complex Rewiring",
            "description": "Full conduit wiring, circuit isolation, and safety grounding for 12 residential apartment units.",
            "date": "2026-09-18",
            "location": "Kadri Hills, Mangaluru",
            "quantity": 12.0,
            "quantity_unit": "units",
            "trade": "Electrical",
            "skills": ["Residential Wiring", "Panel Installation"],
            "status": "CONFIRMED",
            "created_at": "2026-09-18T09:00:00Z",
            "evidence": [
                {
                    "id": "ev_004",
                    "work_record_id": "work_002",
                    "type": "PHOTO",
                    "url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
                    "description": "Sub-panel conduit cabling and color code routing",
                    "created_at": "2026-09-18T10:00:00Z"
                }
            ],
            "confirmations": [
                {
                    "id": "conf_003",
                    "work_record_id": "work_002",
                    "verifier_name": "Rajesh Hegde",
                    "verifier_type": "CUSTOMER",
                    "status": "CONFIRMED",
                    "token": "tok_demo_rajesh",
                    "created_at": "2026-09-18T16:00:00Z",
                    "verified_at": "2026-09-19T08:00:00Z"
                }
            ]
        },
        {
            "id": "work_003",
            "worker_id": "ravi_kumar_001",
            "title": "Industrial Three-Phase Motor Servicing",
            "description": "Insulation resistance testing, bearing replacement, and star-delta starter repair for 8 heavy pump motors.",
            "date": "2026-08-30",
            "location": "Baikampady Industrial Area, Mangaluru",
            "quantity": 8.0,
            "quantity_unit": "motors",
            "trade": "Electrical",
            "skills": ["Motor Repair", "Industrial Maintenance"],
            "status": "PENDING",
            "created_at": "2026-08-30T14:00:00Z",
            "evidence": [
                {
                    "id": "ev_005",
                    "work_record_id": "work_003",
                    "type": "PHOTO",
                    "url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
                    "description": "Motor stator rewinding and rotor alignment check",
                    "created_at": "2026-08-30T15:00:00Z"
                }
            ],
            "confirmations": [
                {
                    "id": "conf_004",
                    "work_record_id": "work_003",
                    "verifier_name": "Coastal Foods Plant Manager",
                    "verifier_type": "SUPERVISOR",
                    "relationship": "Plant Maintenance Head",
                    "status": "PENDING",
                    "token": "tok_verify_motor_001",
                    "requested_at": "2026-08-30T16:00:00Z",
                    "responded_at": None,
                    "created_at": "2026-08-30T16:00:00Z",
                    "verified_at": None
                }
            ]
        }
    ],
    "confirmations": [
        {
            "id": "conf_001",
            "work_record_id": "work_001",
            "worker_id": "ravi_kumar_001",
            "verifier_name": "Anil Sharma",
            "verifier_type": "SUPERVISOR",
            "relationship": "Site Supervisor",
            "status": "CONFIRMED",
            "token": "tok_demo_anil",
            "note": "Main switchgear aligned and tested according to safety standards.",
            "requested_at": "2026-10-02T15:00:00Z",
            "responded_at": "2026-10-03T09:30:00Z",
            "created_at": "2026-10-02T15:00:00Z",
            "verified_at": "2026-10-03T09:30:00Z"
        },
        {
            "id": "conf_002",
            "work_record_id": "work_001",
            "worker_id": "ravi_kumar_001",
            "verifier_name": "Metro Infra Contracting",
            "verifier_type": "EMPLOYER",
            "relationship": "General Contractor Employer",
            "status": "CONFIRMED",
            "token": "tok_demo_metro",
            "note": "Work completed on schedule for commercial client.",
            "requested_at": "2026-10-02T15:00:00Z",
            "responded_at": "2026-10-03T11:00:00Z",
            "created_at": "2026-10-02T15:00:00Z",
            "verified_at": "2026-10-03T11:00:00Z"
        },
        {
            "id": "conf_003",
            "work_record_id": "work_002",
            "worker_id": "ravi_kumar_001",
            "verifier_name": "Rajesh Hegde",
            "verifier_type": "CUSTOMER",
            "relationship": "Apartment Complex Resident Committee",
            "status": "CONFIRMED",
            "token": "tok_demo_rajesh",
            "note": "Conduit wiring for all 12 units completed cleanly.",
            "requested_at": "2026-09-18T16:00:00Z",
            "responded_at": "2026-09-19T08:00:00Z",
            "created_at": "2026-09-18T16:00:00Z",
            "verified_at": "2026-09-19T08:00:00Z"
        },
        {
            "id": "conf_004",
            "work_record_id": "work_003",
            "worker_id": "ravi_kumar_001",
            "verifier_name": "Coastal Foods Plant Manager",
            "verifier_type": "SUPERVISOR",
            "relationship": "Plant Maintenance Head",
            "status": "PENDING",
            "token": "tok_verify_motor_001",
            "note": None,
            "requested_at": "2026-08-30T16:00:00Z",
            "responded_at": None,
            "created_at": "2026-08-30T16:00:00Z",
            "verified_at": None
        }
    ],
    "seed_workers": [
        {
            "id": "worker_anil",
            "user_id": "user_anil_001",
            "name": "Anil Joseph",
            "trade": "Electrician",
            "experience_years": 5,
            "location": "Mangaluru, Karnataka",
            "bio": "Certified electrician focused on residential conduit wiring, sub-distribution boards, and solar inverter integration.",
            "profile_photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
            "email": "anil.joseph@vouchwork.in",
            "phone": "+91 98451 23456",
            "languages": ["Kannada", "English"],
            "public_slug": "anil-joseph-93b1"
        },
        {
            "id": "worker_002",
            "user_id": "user_suresh_002",
            "name": "Suresh M.",
            "trade": "Plumber",
            "experience_years": 9,
            "location": "Bengaluru, Karnataka",
            "bio": "Commercial plumber specializing in high-rise drainage systems, water manifold assembly, and booster pump setups.",
            "profile_photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
            "email": "suresh.m@vouchwork.in",
            "phone": "+91 98860 34567",
            "languages": ["Kannada", "Tamil", "English"],
            "public_slug": "suresh-m-44c2"
        },
        {
            "id": "worker_003",
            "user_id": "user_vikram_003",
            "name": "Vikram Patil",
            "trade": "Welder",
            "experience_years": 5,
            "location": "Udupi, Karnataka",
            "bio": "Certified structural welder experienced with TIG & Arc welding, structural steel trusses, and industrial gate fabrication.",
            "profile_photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
            "email": "vikram.patil@vouchwork.in",
            "phone": "+91 98440 45678",
            "languages": ["Kannada", "Hindi"],
            "public_slug": "vikram-patil-17d9"
        },
        {
            "id": "worker_dinesh",
            "user_id": "user_dinesh_004",
            "name": "Dinesh Acharya",
            "trade": "Carpenter",
            "experience_years": 8,
            "location": "Mangaluru, Karnataka",
            "bio": "Master carpenter skilled in modular shuttering formwork, hardwood joinery, and architectural framing.",
            "profile_photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
            "email": "dinesh.acharya@vouchwork.in",
            "phone": "+91 98455 56789",
            "languages": ["Kannada", "Tulu", "Hindi"],
            "public_slug": "dinesh-acharya-62e5"
        },
        {
            "id": "worker_riaz",
            "user_id": "user_riaz_005",
            "name": "Mohammed Riaz",
            "trade": "Technician",
            "experience_years": 6,
            "location": "Mangaluru, Karnataka",
            "bio": "HVAC and refrigeration technician specializing in commercial chiller commissioning, VRF ducting, and leak testing.",
            "profile_photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
            "email": "mohammed.riaz@vouchwork.in",
            "phone": "+91 99001 67890",
            "languages": ["Urdu", "Kannada", "English"],
            "public_slug": "mohammed-riaz-51f8"
        },
        {
            "id": "worker_karthik",
            "user_id": "user_karthik_006",
            "name": "Karthik Poojary",
            "trade": "Construction",
            "experience_years": 4,
            "location": "Surathkal, Karnataka",
            "bio": "Construction site craftsman specializing in RCC foundation rebar tying, scaffolding, and curing inspection.",
            "profile_photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            "email": "karthik.poojary@vouchwork.in",
            "phone": "+91 99160 78901",
            "languages": ["Kannada", "Tulu"],
            "public_slug": "karthik-poojary-78a3"
        }
    ]
}

# Attach rich demo work records for the seed workers
_ADDITIONAL_SEED_WORKS = [
    {
        "id": "work_anil_01",
        "worker_id": "worker_anil",
        "title": "Apartment Submeter & DB Installation",
        "description": "Installed sub-distribution boards and modular MCBs across 8 residential apartments in Mangaluru.",
        "date": "2026-09-10",
        "location": "Bejai, Mangaluru",
        "quantity": 8.0,
        "quantity_unit": "units",
        "trade": "Electrical",
        "skills": ["Residential Wiring", "Panel Installation"],
        "status": "CONFIRMED",
        "created_at": "2026-09-10T10:00:00Z",
        "evidence": [
            {
                "id": "ev_anil_01",
                "work_record_id": "work_anil_01",
                "type": "PHOTO",
                "url": "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=80",
                "description": "Submeter and MCB enclosure dressed and tested",
                "created_at": "2026-09-10T11:00:00Z"
            }
        ],
        "confirmations": [
            {
                "id": "conf_anil_01",
                "work_record_id": "work_anil_01",
                "verifier_name": "Prakash Rao",
                "verifier_type": "SUPERVISOR",
                "status": "CONFIRMED",
                "token": "tok_anil_01",
                "created_at": "2026-09-10T12:00:00Z",
                "verified_at": "2026-09-11T09:00:00Z"
            }
        ]
    },
    {
        "id": "work_suresh_01",
        "worker_id": "worker_002",
        "title": "Commercial Drainage & Soil Pipe Line",
        "description": "Installed 110mm PVC multi-floor soil pipe network and grease traps at commercial tech park.",
        "date": "2026-08-22",
        "location": "Whitefield, Bengaluru",
        "quantity": 180.0,
        "quantity_unit": "meters",
        "trade": "Plumbing",
        "skills": ["Commercial Pipefitting", "Drainage Systems"],
        "status": "CONFIRMED",
        "created_at": "2026-08-22T09:30:00Z",
        "evidence": [
            {
                "id": "ev_suresh_01",
                "work_record_id": "work_suresh_01",
                "type": "PHOTO",
                "url": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80",
                "description": "Vertical stack piping alignment and brackets",
                "created_at": "2026-08-22T10:00:00Z"
            }
        ],
        "confirmations": [
            {
                "id": "conf_suresh_01",
                "work_record_id": "work_suresh_01",
                "verifier_name": "Bengaluru Infra Lead",
                "verifier_type": "SUPERVISOR",
                "status": "CONFIRMED",
                "token": "tok_suresh_01",
                "created_at": "2026-08-22T11:00:00Z",
                "verified_at": "2026-08-23T10:00:00Z"
            }
        ]
    },
    {
        "id": "work_vikram_01",
        "worker_id": "worker_003",
        "title": "Structural MS Truss Fabrication & Arc Welding",
        "description": "Fabricated and welded heavy MS structural steel trusses for commercial warehouse shed.",
        "date": "2026-07-15",
        "location": "Industrial Area, Udupi",
        "quantity": 12.0,
        "quantity_unit": "trusses",
        "trade": "Welding",
        "skills": ["Arc Welding", "Structural Fabrication"],
        "status": "CONFIRMED",
        "created_at": "2026-07-15T08:30:00Z",
        "evidence": [
            {
                "id": "ev_vikram_01",
                "work_record_id": "work_vikram_01",
                "type": "PHOTO",
                "url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
                "description": "Gusset plate fillet welds and truss alignment",
                "created_at": "2026-07-15T11:00:00Z"
            }
        ],
        "confirmations": [
            {
                "id": "conf_vikram_01",
                "work_record_id": "work_vikram_01",
                "verifier_name": "Coastal Engineering Works",
                "verifier_type": "EMPLOYER",
                "status": "CONFIRMED",
                "token": "tok_vikram_01",
                "created_at": "2026-07-15T12:00:00Z",
                "verified_at": "2026-07-16T09:00:00Z"
            }
        ]
    },
    {
        "id": "work_dinesh_01",
        "worker_id": "worker_dinesh",
        "title": "Modular Formwork Shuttering",
        "description": "Erected precision aluminum formwork for residential tower columns and lift core walls.",
        "date": "2026-06-12",
        "location": "Kankanady, Mangaluru",
        "quantity": 450.0,
        "quantity_unit": "sqm",
        "trade": "Carpentry",
        "skills": ["Modular Formwork"],
        "status": "CONFIRMED",
        "created_at": "2026-06-12T08:00:00Z",
        "evidence": [
            {
                "id": "ev_dinesh_01",
                "work_record_id": "work_dinesh_01",
                "type": "PHOTO",
                "url": "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80",
                "description": "Plumb line verified column shuttering assembly",
                "created_at": "2026-06-12T09:30:00Z"
            }
        ],
        "confirmations": [
            {
                "id": "conf_dinesh_01",
                "work_record_id": "work_dinesh_01",
                "verifier_name": "Mangalore Builders Consortium",
                "verifier_type": "SUPERVISOR",
                "status": "CONFIRMED",
                "token": "tok_dinesh_01",
                "created_at": "2026-06-12T14:00:00Z",
                "verified_at": "2026-06-13T10:00:00Z"
            }
        ]
    },
    {
        "id": "work_riaz_01",
        "worker_id": "worker_riaz",
        "title": "Commercial Chiller Duct & Refrigerant Line",
        "description": "Installed copper refrigerant lines and VRF cassette units for medical center.",
        "date": "2026-05-20",
        "location": "Balmatta, Mangaluru",
        "quantity": 6.0,
        "quantity_unit": "cassettes",
        "trade": "HVAC",
        "skills": ["HVAC Installation", "Chiller Commissioning"],
        "status": "CONFIRMED",
        "created_at": "2026-05-20T10:00:00Z",
        "evidence": [
            {
                "id": "ev_riaz_01",
                "work_record_id": "work_riaz_01",
                "type": "PHOTO",
                "url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
                "description": "Pressure tested nitrogen line and braze joints",
                "created_at": "2026-05-20T11:30:00Z"
            }
        ],
        "confirmations": [
            {
                "id": "conf_riaz_01",
                "work_record_id": "work_riaz_01",
                "verifier_name": "Horizon Clinic Facilities",
                "verifier_type": "SUPERVISOR",
                "status": "CONFIRMED",
                "token": "tok_riaz_01",
                "created_at": "2026-05-20T14:00:00Z",
                "verified_at": "2026-05-21T09:00:00Z"
            }
        ]
    },
    {
        "id": "work_karthik_01",
        "worker_id": "worker_karthik",
        "title": "RCC Slab Rebar Tying & Footing Inspection",
        "description": "Tied reinforcement steel cages for foundation footings and grade beams.",
        "date": "2026-04-10",
        "location": "Surathkal, Karnataka",
        "quantity": 4.5,
        "quantity_unit": "tons",
        "trade": "Construction",
        "skills": ["Rebar Tying", "Concrete Curing"],
        "status": "CONFIRMED",
        "created_at": "2026-04-10T09:00:00Z",
        "evidence": [
            {
                "id": "ev_karthik_01",
                "work_record_id": "work_karthik_01",
                "type": "PHOTO",
                "url": "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80",
                "description": "Rebar spacing and chair support placement",
                "created_at": "2026-04-10T10:30:00Z"
            }
        ],
        "confirmations": [
            {
                "id": "conf_karthik_01",
                "work_record_id": "work_karthik_01",
                "verifier_name": "Surathkal Engineering Works",
                "verifier_type": "SUPERVISOR",
                "status": "CONFIRMED",
                "token": "tok_karthik_01",
                "created_at": "2026-04-10T12:00:00Z",
                "verified_at": "2026-04-11T10:00:00Z"
            }
        ]
    }
]

# Merge additional seed works into _MEMORY_STORE["work_records"]
for _sw in _ADDITIONAL_SEED_WORKS:
    if not any(w["id"] == _sw["id"] for w in _MEMORY_STORE["work_records"]):
        _MEMORY_STORE["work_records"].append(_sw)

def sync_seed_to_firestore():
    """Initializes Firestore collections if empty."""
    db = get_db()
    if not db:
        return
    try:
        worker_ref = db.collection("workers").document(_MEMORY_STORE["worker"]["id"])
        if not worker_ref.get().exists:
            worker_ref.set(_MEMORY_STORE["worker"])
            logger.info("Seeded primary worker profile to Firestore")
            
        for sw in _MEMORY_STORE.get("seed_workers", []):
            sw_ref = db.collection("workers").document(sw["id"])
            if not sw_ref.get().exists:
                sw_ref.set(sw)
                logger.info(f"Seeded worker {sw['id']} to Firestore")
            
        for w in _MEMORY_STORE["work_records"]:
            w_ref = db.collection("work_records").document(w["id"])
            if not w_ref.get().exists:
                w_ref.set(w)
                logger.info(f"Seeded work record {w['id']} to Firestore")
                
        for c in _MEMORY_STORE["confirmations"]:
            c_ref = db.collection("confirmations").document(c["id"])
            if not c_ref.get().exists:
                c_ref.set(c)
                logger.info(f"Seeded confirmation {c['id']} to dedicated Firestore collection")
    except Exception as e:
        logger.warning(f"Could not seed Firestore (using in-memory store): {e}")

_ACTIVE_WORKER_ID = "ravi_kumar_001"

def set_active_worker_id(worker_id: str):
    global _ACTIVE_WORKER_ID
    _ACTIVE_WORKER_ID = worker_id

def get_active_worker_id() -> str:
    return _ACTIVE_WORKER_ID or "ravi_kumar_001"

def get_current_worker(worker_id: Optional[str] = None, allow_ravi_fallback: bool = True) -> Optional[Dict[str, Any]]:
    target_id = worker_id or ("ravi_kumar_001" if allow_ravi_fallback else None)
    if not target_id:
        return None

    db = get_db()
    if db:
        try:
            doc = db.collection("workers").document(target_id).get()
            if doc.exists:
                data = doc.to_dict()
                return _enrich_worker_data(data)
        except Exception as e:
            logger.warning(f"Error reading worker {target_id} from Firestore: {e}")
            
    if target_id == _MEMORY_STORE["worker"].get("id"):
        return _enrich_worker_data(_MEMORY_STORE["worker"])

    for w in _MEMORY_STORE.get("seed_workers", []):
        if w.get("id") == target_id:
            return _enrich_worker_data(w)

    for w in _MEMORY_STORE.get("custom_workers", []):
        if w.get("id") == target_id:
            return _enrich_worker_data(w)

    if allow_ravi_fallback:
        return _enrich_worker_data(_MEMORY_STORE["worker"])

    return None

def get_worker_by_slug(public_slug: str) -> Optional[Dict[str, Any]]:
    db = get_db()
    if db:
        try:
            from google.cloud.firestore_v1.base_query import FieldFilter
            docs = list(db.collection("workers").where(filter=FieldFilter("public_slug", "==", public_slug)).stream())
            if docs:
                return _enrich_worker_data(docs[0].to_dict())
        except Exception as e:
            logger.warning(f"Error querying worker by slug {public_slug}: {e}")

    if _MEMORY_STORE["worker"].get("public_slug") == public_slug or public_slug == "ravi-kumar-82a7":
        return _enrich_worker_data(_MEMORY_STORE["worker"])

    for w in _MEMORY_STORE.get("seed_workers", []):
        if w.get("public_slug") == public_slug:
            return _enrich_worker_data(w)

    for w in _MEMORY_STORE.get("custom_workers", []):
        if w.get("public_slug") == public_slug:
            return _enrich_worker_data(w)

    return None

def get_all_workers() -> List[Dict[str, Any]]:
    """Retrieves and enriches all real workers in the system (Firestore + memory)."""
    workers_by_id: Dict[str, Dict[str, Any]] = {}

    # 1. Firestore workers
    db = get_db()
    if db:
        try:
            docs = list(db.collection("workers").stream())
            for doc in docs:
                data = doc.to_dict()
                if data and "id" in data:
                    workers_by_id[data["id"]] = data
        except Exception as e:
            logger.warning(f"Error reading all workers from Firestore: {e}")

    # 2. Seed worker (Ravi Kumar)
    seed_w = _MEMORY_STORE.get("worker")
    if seed_w and seed_w.get("id") and seed_w["id"] not in workers_by_id:
        workers_by_id[seed_w["id"]] = seed_w

    # 3. Seed demo workers
    for sw in _MEMORY_STORE.get("seed_workers", []):
        if sw and sw.get("id") and sw["id"] not in workers_by_id:
            workers_by_id[sw["id"]] = sw

    # 4. In-memory custom workers
    for cw in _MEMORY_STORE.get("custom_workers", []):
        if cw and cw.get("id") and cw["id"] not in workers_by_id:
            workers_by_id[cw["id"]] = cw

    results = []
    for w_data in workers_by_id.values():
        try:
            results.append(_enrich_worker_data(w_data))
        except Exception as e:
            logger.warning(f"Error enriching worker {w_data.get('id')}: {e}")
            results.append(w_data)

    return results

def get_worker_by_email(email: str) -> Optional[Dict[str, Any]]:
    if not email or not isinstance(email, str):
        return None
    clean_email = email.strip().lower()
    if not clean_email:
        return None

    db = get_db()
    if db:
        try:
            from google.cloud.firestore_v1.base_query import FieldFilter
            docs = list(db.collection("workers").where(filter=FieldFilter("email", "==", clean_email)).limit(1).stream())
            if docs:
                return _enrich_worker_data(docs[0].to_dict())
        except Exception as e:
            logger.warning(f"Error querying worker by email {clean_email} in Firestore: {e}")

    for w in _MEMORY_STORE.get("custom_workers", []):
        if (w.get("email") or "").strip().lower() == clean_email:
            return _enrich_worker_data(w)

    seed_email = (_MEMORY_STORE["worker"].get("email") or "").strip().lower()
    if seed_email and seed_email == clean_email:
        return _enrich_worker_data(_MEMORY_STORE["worker"])

    return None

def _process_initial_works(worker_id: str, trade: Optional[str], default_location: Optional[str], data: Dict[str, Any]):
    raw_works = data.get("initial_works")
    if not raw_works:
        single = data.get("initial_work")
        raw_works = [single] if single else []

    for item in raw_works[:5]:
        if not item:
            continue
        if not isinstance(item, dict):
            if hasattr(item, "model_dump"):
                item = item.model_dump()
            elif hasattr(item, "dict"):
                item = item.dict()
            else:
                continue
        title = item.get("title")
        if not title or not str(title).strip():
            continue

        work_payload = {
            "title": str(title).strip() or f"{trade or 'Trade'} Project",
            "description": item.get("description") or "Work project logged during onboarding.",
            "employer_name": item.get("employer") or item.get("employer_name"),
            "role": item.get("role"),
            "location": item.get("location") or default_location,
            "trade": trade,
            "skills": item.get("skills") or data.get("skills", []),
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        }
        created_work = create_work_record(worker_id, work_payload)

        # Evidence support (imageUrl or evidence_url)
        ev_url = item.get("evidence_url") or item.get("imageUrl")
        if ev_url:
            add_evidence(created_work["id"], {
                "type": item.get("evidence_type") or "PHOTO",
                "url": ev_url,
                "description": item.get("evidence_description") or item.get("evidence_title") or f"{title} completion evidence"
            })

        # Verifier support
        verifier_name = item.get("verifierName") or item.get("verifier_name")
        if verifier_name:
            request_confirmation(
                work_id=created_work["id"],
                verifier_name=verifier_name,
                verifier_type="SUPERVISOR",
                relationship=item.get("verifierRole") or item.get("verifier_role") or "Site Supervisor",
                note="Initial onboarding project verification request."
            )

def create_worker_profile(data: Dict[str, Any]) -> Dict[str, Any]:
    import re
    worker_id = f"worker_{uuid.uuid4().hex[:8]}"
    name = data.get("name", "Skilled Worker")
    slug_base = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-') or "worker"
    public_slug = f"{slug_base}-{uuid.uuid4().hex[:4]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    raw_email = data.get("email")
    clean_email = raw_email.strip().lower() if raw_email and isinstance(raw_email, str) else None
    
    worker_record = {
        "id": worker_id,
        "user_id": data.get("user_id") or f"user_{uuid.uuid4().hex[:8]}",
        "name": name,
        "email": clean_email,
        "phone": data.get("phone"),
        "trade": data.get("trade", "Tradesperson"),
        "experience_years": data.get("experience_years", 0),
        "location": data.get("location", "India"),
        "languages": data.get("languages") or [],
        "bio": data.get("bio") or f"Skilled {data.get('trade', 'professional')} with {data.get('experience_years', 0)} years documented experience.",
        "profile_photo_url": data.get("profile_photo_url") or "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
        "public_slug": public_slug,
        "created_at": now_iso
    }
    
    _MEMORY_STORE.setdefault("custom_workers", []).append(worker_record)
    
    db = get_db()
    if db:
        try:
            db.collection("workers").document(worker_id).set(worker_record)
            logger.info(f"Persisted new worker profile {worker_id} to Firestore")
        except Exception as e:
            logger.warning(f"Error persisting worker {worker_id} to Firestore: {e}")
            
    _process_initial_works(worker_id, data.get("trade"), data.get("location"), data)

    if not data.get("user_id"):
        set_active_worker_id(worker_id)
    return _enrich_worker_data(worker_record)

def update_worker_profile(worker_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    db = get_db()
    existing: Optional[Dict[str, Any]] = None

    if db:
        try:
            doc = db.collection("workers").document(worker_id).get()
            if doc.exists:
                existing = doc.to_dict()
        except Exception as e:
            logger.warning(f"Error fetching worker {worker_id} from Firestore: {e}")

    if not existing:
        for w in _MEMORY_STORE.get("custom_workers", []):
            if w.get("id") == worker_id:
                existing = w
                break

    if not existing:
        # If record not yet found, create it with this worker_id
        payload = dict(data)
        payload["id"] = worker_id
        return create_worker_profile(payload)

    # Update existing record fields
    if data.get("name"):
        existing["name"] = data["name"].strip()
    if data.get("trade"):
        existing["trade"] = data["trade"].strip()
    if data.get("experience_years") is not None:
        existing["experience_years"] = data["experience_years"]
    if data.get("location"):
        existing["location"] = data["location"].strip()
    if data.get("email"):
        existing["email"] = data["email"].strip().lower()
    if data.get("phone"):
        existing["phone"] = data["phone"]
    if data.get("bio"):
        existing["bio"] = data["bio"]
    if data.get("languages") is not None:
        existing["languages"] = data["languages"]
    if data.get("skills"):
        existing["skills"] = data["skills"]
    if data.get("profile_photo_url"):
        existing["profile_photo_url"] = data["profile_photo_url"]

    # Persist in Firestore
    if db:
        try:
            db.collection("workers").document(worker_id).set(existing, merge=True)
            logger.info(f"Updated worker profile {worker_id} in Firestore")
        except Exception as e:
            logger.warning(f"Error updating worker {worker_id} in Firestore: {e}")

    # Persist in Memory Store
    found = False
    for i, w in enumerate(_MEMORY_STORE.get("custom_workers", [])):
        if w.get("id") == worker_id:
            _MEMORY_STORE["custom_workers"][i] = existing
            found = True
            break
    if not found:
        _MEMORY_STORE.setdefault("custom_workers", []).append(existing)

    # Handle initial_works / initial_work
    _process_initial_works(worker_id, existing.get("trade"), existing.get("location"), data)

    return _enrich_worker_data(existing)

def get_work_records(worker_id: Optional[str] = None) -> List[Dict[str, Any]]:
    worker_id = worker_id or "ravi_kumar_001"
    db = get_db()
    if db:
        try:
            from google.cloud.firestore_v1.base_query import FieldFilter
            docs = db.collection("work_records").where(filter=FieldFilter("worker_id", "==", worker_id)).stream()
            results = [d.to_dict() for d in docs]
            if results:
                for r in results:
                    r["confidence"] = calculate_work_confidence(r.get("evidence", []), r.get("confirmations", []))
                return results
        except Exception as e:
            logger.warning(f"Error reading work records from Firestore: {e}")
            
    records = [dict(w) for w in _MEMORY_STORE["work_records"] if w["worker_id"] == worker_id]
    for r in records:
        r["confidence"] = calculate_work_confidence(r.get("evidence", []), r.get("confirmations", []))
    return records

def get_work_record_by_id(work_id: str) -> Optional[Dict[str, Any]]:
    db = get_db()
    if db:
        try:
            doc = db.collection("work_records").document(work_id).get()
            if doc.exists:
                r = doc.to_dict()
                r["confidence"] = calculate_work_confidence(r.get("evidence", []), r.get("confirmations", []))
                return r
        except Exception as e:
            logger.warning(f"Error reading work record {work_id} from Firestore: {e}")
            
    for w in _MEMORY_STORE["work_records"]:
        if w["id"] == work_id:
            r = dict(w)
            r["confidence"] = calculate_work_confidence(r.get("evidence", []), r.get("confirmations", []))
            return r
    return None

def create_work_record(worker_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    work_id = f"work_{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    record = {
        "id": work_id,
        "worker_id": worker_id,
        "title": data.get("title"),
        "description": data.get("description"),
        "date": data.get("date") or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "location": data.get("location") or "Mangaluru",
        "quantity": data.get("quantity"),
        "quantity_unit": data.get("quantity_unit"),
        "trade": data.get("trade") or "Electrical",
        "skills": data.get("skills", []),
        "employer_name": data.get("employer_name"),
        "project_name": data.get("project_name"),
        "organization_id": data.get("organization_id"),
        "status": "PENDING",
        "evidence": [],
        "confirmations": [],
        "created_at": now_iso
    }
    record["confidence"] = calculate_work_confidence([], [])
    
    _MEMORY_STORE["work_records"].insert(0, record)
    
    db = get_db()
    if db:
        try:
            db.collection("work_records").document(work_id).set(record)
        except Exception as e:
            logger.warning(f"Error persisting work record to Firestore: {e}")
            
    return record

def add_evidence(work_id: str, evidence_data: Dict[str, Any]) -> Dict[str, Any]:
    ev_id = f"ev_{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    new_evidence = {
        "id": ev_id,
        "work_record_id": work_id,
        "type": evidence_data.get("type", "PHOTO"),
        "url": evidence_data.get("url"),
        "description": evidence_data.get("description", ""),
        "supports_skills": evidence_data.get("supports_skills", []),
        "added_by_user_id": evidence_data.get("added_by_user_id"),
        "added_by_name": evidence_data.get("added_by_name"),
        "is_self_submitted": evidence_data.get("is_self_submitted", True),
        "verification_status": evidence_data.get("verification_status", "SELF_SUBMITTED"),
        "confirmed_by_name": evidence_data.get("confirmed_by_name"),
        "confirmed_by_role": evidence_data.get("confirmed_by_role"),
        "is_private": evidence_data.get("is_private", False),
        "created_at": now_iso
    }
    
    for w in _MEMORY_STORE["work_records"]:
        if w["id"] == work_id:
            w.setdefault("evidence", []).append(new_evidence)
            break
            
    db = get_db()
    if db:
        try:
            w_ref = db.collection("work_records").document(work_id)
            doc = w_ref.get()
            if doc.exists:
                cur = doc.to_dict()
                evs = cur.get("evidence", [])
                evs.append(new_evidence)
                w_ref.update({"evidence": evs})
        except Exception as e:
            logger.warning(f"Error updating evidence in Firestore: {e}")
            
    return new_evidence

def request_confirmation(
    work_id: str,
    verifier_name: str,
    verifier_type: str,
    relationship: Optional[str] = None,
    note: Optional[str] = None
) -> Dict[str, Any]:
    work = get_work_record_by_id(work_id)
    worker_id = work.get("worker_id", "ravi_kumar_001") if work else "ravi_kumar_001"

    conf_id = f"conf_{uuid.uuid4().hex[:8]}"
    token = f"tok_{uuid.uuid4().hex[:12]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    
    new_conf = {
        "id": conf_id,
        "work_record_id": work_id,
        "worker_id": worker_id,
        "verifier_name": verifier_name,
        "verifier_type": verifier_type,
        "relationship": relationship,
        "status": "PENDING",
        "token": token,
        "note": note,
        "requested_at": now_iso,
        "responded_at": None,
        "created_at": now_iso,
        "verified_at": None
    }
    
    _MEMORY_STORE.setdefault("confirmations", []).append(new_conf)
    
    for w in _MEMORY_STORE["work_records"]:
        if w["id"] == work_id:
            w.setdefault("confirmations", []).append(new_conf)
            break
            
    db = get_db()
    if db:
        try:
            # 1. Dedicated confirmations collection write
            db.collection("confirmations").document(conf_id).set(new_conf)
            # 2. Update embedded cache in work record for MVP read convenience
            w_ref = db.collection("work_records").document(work_id)
            doc = w_ref.get()
            if doc.exists:
                cur = doc.to_dict()
                confs = cur.get("confirmations", [])
                confs.append(new_conf)
                w_ref.update({"confirmations": confs})
        except Exception as e:
            logger.warning(f"Error persisting confirmation in Firestore: {e}")
            
    return new_conf

def get_confirmation_by_token(token: str) -> Optional[Dict[str, Any]]:
    # 1. Direct lookup in Firestore confirmations collection by token
    db = get_db()
    if db:
        try:
            from google.cloud.firestore_v1.base_query import FieldFilter
            docs = list(db.collection("confirmations").where(filter=FieldFilter("token", "==", token)).limit(1).stream())
            if docs:
                conf = docs[0].to_dict()
                work = get_work_record_by_id(conf["work_record_id"])
                return {
                    "confirmation": conf,
                    "work_record": work
                }
        except Exception as e:
            logger.warning(f"Error querying confirmation directly by token from Firestore: {e}")
            
    # 2. Direct lookup in memory store confirmations list
    for c in _MEMORY_STORE.get("confirmations", []):
        if c.get("token") == token:
            work = get_work_record_by_id(c["work_record_id"])
            return {
                "confirmation": c,
                "work_record": work
            }
            
    # 3. Fallback scan in work_records embedded list
    records = get_work_records()
    for w in records:
        for c in w.get("confirmations", []):
            if c.get("token") == token:
                return {
                    "confirmation": c,
                    "work_record": w
                }
    return None

def resolve_confirmation(token: str, decision: str, note: Optional[str] = None) -> Optional[Dict[str, Any]]:
    match = get_confirmation_by_token(token)
    if not match:
        return None
        
    conf = match["confirmation"]
    work = match["work_record"]
    conf_id = conf["id"]
    work_id = work["id"]
    now_iso = datetime.now(timezone.utc).isoformat()
    
    conf["status"] = decision
    conf["responded_at"] = now_iso
    conf["verified_at"] = now_iso
    if note:
        conf["note"] = note
        
    if decision == "CONFIRMED":
        work["status"] = "CONFIRMED"
        
    # Update memory store confirmations
    for c in _MEMORY_STORE.get("confirmations", []):
        if c.get("token") == token:
            c["status"] = decision
            c["responded_at"] = now_iso
            c["verified_at"] = now_iso
            if note:
                c["note"] = note
                
    for w in _MEMORY_STORE["work_records"]:
        if w["id"] == work_id:
            if decision == "CONFIRMED":
                w["status"] = "CONFIRMED"
            for c in w.get("confirmations", []):
                if c.get("token") == token:
                    c["status"] = decision
                    c["responded_at"] = now_iso
                    c["verified_at"] = now_iso
                    if note:
                        c["note"] = note
                        
    db = get_db()
    if db:
        try:
            # 1. Update document in dedicated confirmations collection
            c_update = {
                "status": decision,
                "responded_at": now_iso,
                "verified_at": now_iso
            }
            if note:
                c_update["note"] = note
            db.collection("confirmations").document(conf_id).update(c_update)
            
            # 2. Update embedded array on work_record
            w_ref = db.collection("work_records").document(work_id)
            doc = w_ref.get()
            if doc.exists:
                cur = doc.to_dict()
                confs = cur.get("confirmations", [])
                for c in confs:
                    if c.get("token") == token:
                        c["status"] = decision
                        c["responded_at"] = now_iso
                        c["verified_at"] = now_iso
                        if note:
                            c["note"] = note
                update_dict = {"confirmations": confs}
                if decision == "CONFIRMED":
                    update_dict["status"] = "CONFIRMED"
                w_ref.update(update_dict)
        except Exception as e:
            logger.warning(f"Error persisting confirmation resolution to Firestore: {e}")
            
    return {"confirmation": conf, "work_record": work}

def _enrich_worker_data(worker_dict: Dict[str, Any]) -> Dict[str, Any]:
    works = get_work_records(worker_dict.get("id", "ravi_kumar_001"))
    
    # Calculate unique skills
    skill_map: Dict[str, List[Dict[str, Any]]] = {}
    total_confirms = 0
    
    for w in works:
        for s in w.get("skills", []):
            skill_map.setdefault(s, []).append(w)
        for c in w.get("confirmations", []):
            if c.get("status") == "CONFIRMED":
                total_confirms += 1
                
    demonstrated_skills = []
    total_confidence_sum = 0
    for s_name, relevant in skill_map.items():
        s_conf = calculate_skill_confidence(s_name, relevant)
        demonstrated_skills.append(s_conf)
        total_confidence_sum += s_conf.confidence
        
    overall_conf = int(total_confidence_sum / len(demonstrated_skills)) if demonstrated_skills else 0
    
    has_history = len(works) > 0
    has_ev = any(len(w.get("evidence", [])) > 0 for w in works)
    has_conf = total_confirms > 0
    completeness_score = 25 + (25 if has_history else 0) + (25 if has_ev else 0) + (25 if has_conf else 0)

    enriched = dict(worker_dict)
    enriched["languages"] = worker_dict.get("languages") or []
    enriched["phone"] = worker_dict.get("phone")
    enriched["work_count"] = len(works)
    enriched["confirmation_count"] = total_confirms
    enriched["overall_confidence"] = overall_conf
    enriched["demonstrated_skills"] = demonstrated_skills
    enriched["passport_completeness"] = PassportCompleteness(
        score=completeness_score,
        profile_complete=True,
        has_work_history=has_history,
        has_evidence=has_ev,
        has_confirmations=has_conf,
        breakdown=f"Profile verified, {len(works)} projects, {total_confirms} confirmations."
    )
    return enriched
