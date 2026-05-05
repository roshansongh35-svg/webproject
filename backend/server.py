from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# -------------------- Setup --------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="ARKIV Capstone API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


# -------------------- Auth utils --------------------
JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 12,
        path="/",
    )


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# -------------------- Models --------------------
class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: EmailStr
    role: str = "student"
    created_at: str
    token: Optional[str] = None


class RecordIn(BaseModel):
    student_name: str = Field(min_length=2, max_length=80)
    student_id: str = Field(min_length=2, max_length=40)
    course: str = Field(min_length=1, max_length=80)
    semester: str = Field(min_length=1, max_length=20)
    gpa: float = Field(ge=0.0, le=4.0)
    notes: Optional[str] = Field(default="", max_length=300)


class RecordOut(RecordIn):
    id: str
    created_by: str
    created_by_name: str
    created_at: str


class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    subject: str = Field(min_length=2, max_length=120)
    message: str = Field(min_length=5, max_length=2000)


# -------------------- Routes: base --------------------
@api.get("/")
async def root():
    return {"message": "ARKIV Capstone API", "status": "ok"}


@api.get("/health")
async def health():
    return {"ok": True, "time": datetime.now(timezone.utc).isoformat()}


# -------------------- Routes: auth --------------------
@api.post("/auth/register", response_model=UserOut)
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": email,
        "password_hash": hash_password(payload.password),
        "role": "student",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc)
    token = create_access_token(user_doc["id"], user_doc["email"])
    set_auth_cookie(response, token)
    user_doc.pop("password_hash", None)
    user_doc.pop("_id", None)
    user_doc["token"] = token
    return user_doc


@api.post("/auth/login", response_model=UserOut)
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    set_auth_cookie(response, token)
    user.pop("password_hash", None)
    user.pop("_id", None)
    user["token"] = token
    return user


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api.get("/auth/me", response_model=UserOut)
async def me(current=Depends(get_current_user)):
    return current


# -------------------- Routes: records (CRUD - Create & Read) --------------------
@api.post("/records", response_model=RecordOut)
async def create_record(payload: RecordIn, current=Depends(get_current_user)):
    rec = {
        "id": str(uuid.uuid4()),
        **payload.model_dump(),
        "created_by": current["id"],
        "created_by_name": current["name"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.records.insert_one(rec)
    rec.pop("_id", None)
    return rec


@api.get("/records", response_model=List[RecordOut])
async def list_records(current=Depends(get_current_user)):
    items = await db.records.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@api.get("/records/public", response_model=List[RecordOut])
async def list_records_public():
    # Anonymized sample for the public Features/Home preview
    items = await db.records.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)
    return items


# -------------------- Routes: stats --------------------
@api.get("/stats")
async def stats():
    total_users = await db.users.count_documents({})
    total_records = await db.records.count_documents({})
    total_messages = await db.messages.count_documents({})
    avg_gpa = 0.0
    if total_records:
        pipeline = [{"$group": {"_id": None, "avg": {"$avg": "$gpa"}}}]
        agg = await db.records.aggregate(pipeline).to_list(1)
        avg_gpa = round(agg[0]["avg"], 2) if agg else 0.0
    return {
        "total_users": total_users,
        "total_records": total_records,
        "total_messages": total_messages,
        "avg_gpa": avg_gpa,
    }


# -------------------- Routes: contact --------------------
@api.post("/contact")
async def contact(payload: ContactIn):
    doc = {
        "id": str(uuid.uuid4()),
        **payload.model_dump(),
        "email": payload.email.lower(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.messages.insert_one(doc)
    doc.pop("_id", None)
    return {"ok": True, "id": doc["id"]}


# -------------------- App wiring --------------------
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.records.create_index("created_at")
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@arkiv.edu").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "name": "Administrator",
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Updated admin password for %s", admin_email)


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
