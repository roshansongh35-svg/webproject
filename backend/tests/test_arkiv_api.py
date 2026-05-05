import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://php-mysql-project-4.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@arkiv.edu"
ADMIN_PASSWORD = "Admin@123"


# -------- Health & Stats (public) --------
def test_health():
    r = requests.get(f"{API}/health")
    assert r.status_code == 200
    data = r.json()
    assert data["ok"] is True
    assert "time" in data


def test_stats_public():
    r = requests.get(f"{API}/stats")
    assert r.status_code == 200
    data = r.json()
    for k in ("total_users", "total_records", "total_messages", "avg_gpa"):
        assert k in data
    assert isinstance(data["total_users"], int)


def test_records_public():
    r = requests.get(f"{API}/records/public")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# -------- Auth flows --------
def test_register_creates_user_with_cookie_and_token():
    s = requests.Session()
    email = f"test_{uuid.uuid4().hex[:10]}@arkiv.example.com"
    r = s.post(f"{API}/auth/register", json={"name": "Test User", "email": email, "password": "secret123"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email"] == email
    assert data["name"] == "Test User"
    assert "id" in data
    assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 10
    assert "access_token" in s.cookies, f"Cookies set: {s.cookies.keys()}"

    # /auth/me with cookie
    me = s.get(f"{API}/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == email


def test_register_duplicate_email_400():
    email = f"dup_{uuid.uuid4().hex[:8]}@arkiv.example.com"
    payload = {"name": "Dup", "email": email, "password": "secret123"}
    r1 = requests.post(f"{API}/auth/register", json=payload)
    assert r1.status_code == 200
    r2 = requests.post(f"{API}/auth/register", json=payload)
    assert r2.status_code == 400


def test_login_admin_success_sets_cookie_and_token():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "admin"
    assert "token" in data and len(data["token"]) > 10
    assert "access_token" in s.cookies


def test_login_wrong_password_401():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WrongPwd!1"})
    assert r.status_code == 401


def test_me_without_auth_401():
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_logout_clears_cookie():
    s = requests.Session()
    s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert "access_token" in s.cookies
    r = s.post(f"{API}/auth/logout")
    assert r.status_code == 200
    # After logout, /auth/me should be 401 if cookie cleared (session may keep deleted cookie)
    s.cookies.clear()
    me = s.get(f"{API}/auth/me")
    assert me.status_code == 401


# -------- Records --------
def test_records_create_requires_auth():
    r = requests.post(f"{API}/records", json={
        "student_name": "X", "student_id": "S1", "course": "CS",
        "semester": "F25", "gpa": 3.0, "notes": ""
    })
    assert r.status_code == 401


def test_records_create_and_list_with_bearer_token():
    # login via admin to get token
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "student_name": f"TEST_Student_{uuid.uuid4().hex[:6]}",
        "student_id": f"TS-{uuid.uuid4().hex[:6]}",
        "course": "Computer Science",
        "semester": "Fall 2025",
        "gpa": 3.75,
        "notes": "test record",
    }
    cr = requests.post(f"{API}/records", json=payload, headers=headers)
    assert cr.status_code == 200, cr.text
    created = cr.json()
    assert created["student_name"] == payload["student_name"]
    assert created["gpa"] == 3.75
    assert "id" in created and "created_by" in created

    lr = requests.get(f"{API}/records", headers=headers)
    assert lr.status_code == 200
    items = lr.json()
    assert any(it["id"] == created["id"] for it in items)


def test_records_gpa_validation():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    bad = {"student_name": "X", "student_id": "S1", "course": "C",
           "semester": "F25", "gpa": 5.0, "notes": ""}
    rr = requests.post(f"{API}/records", json=bad, headers=headers)
    assert rr.status_code == 422


# -------- Contact --------
def test_contact_public_success():
    r = requests.post(f"{API}/contact", json={
        "name": "Test Contact",
        "email": f"contact_{uuid.uuid4().hex[:6]}@arkiv.example.com",
        "subject": "Hello",
        "message": "This is a test message body.",
    })
    assert r.status_code == 200
    assert r.json()["ok"] is True
