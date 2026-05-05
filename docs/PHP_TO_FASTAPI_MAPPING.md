# PHP / MySQL → FastAPI / MongoDB — Concept Map

This document shows that every requirement of the original capstone brief (PHP + MySQL) is preserved in the ARKIV implementation. The technologies differ; the **roles** are identical.

| Concept (PHP / MySQL world)          | ARKIV equivalent (Python / FastAPI / Mongo)                                | Where in code                                  |
| ------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------- |
| `<form action="register.php">`       | `POST /api/auth/register`                                                  | `backend/server.py` → `register()`              |
| `$_POST` superglobal                 | Pydantic model `RegisterIn(BaseModel)`                                     | `backend/server.py`                              |
| `mysqli_real_escape_string` / PDO    | Pydantic field validators (`min_length`, `EmailStr`, regex)                | `RegisterIn`, `LoginIn`, `RecordIn`              |
| `mysqli_query("INSERT INTO users…")` | `await db.users.insert_one({...})`                                          | `register()`                                    |
| `mysqli_query("SELECT … WHERE email=?")` | `await db.users.find_one({"email": email})`                              | `login()`, `get_current_user()`                  |
| `password_hash()` / `password_verify()` | `bcrypt.hashpw()` / `bcrypt.checkpw()`                                   | `hash_password()` / `verify_password()`          |
| `session_start()` + `$_SESSION`      | JWT in `httpOnly` cookie + `get_current_user` dependency                    | `set_auth_cookie()` / `get_current_user()`        |
| `setcookie("session", …)`            | `response.set_cookie(key="access_token", httponly=True, …)`                 | `set_auth_cookie()`                              |
| `session_destroy()`                  | `response.delete_cookie("access_token")`                                    | `logout()`                                      |
| `header("Location: /dashboard.php")` | React Router `<Navigate to="/data" />` after login                         | `frontend/src/pages/Login.jsx`                   |
| `<?php require 'auth.php'; ?>`       | `Depends(get_current_user)` on protected routes + `<ProtectedRoute>` in UI | `Data` route                                    |
| `if (!$_SESSION) header("/login")`   | `<ProtectedRoute>` redirects unauth users                                   | `frontend/src/components/ProtectedRoute.jsx`     |
| MySQL table `users (id, email, password, …)` | Mongo collection `users` with the same field set                     | startup `db.users.create_index("email", unique=True)` |
| MySQL table `records (…)`            | Mongo collection `records`                                                  | `create_record()`                                |
| MySQL `AUTO_INCREMENT id`            | UUID4 stored as `id` field (string)                                         | `uuid.uuid4()` everywhere                        |
| MySQL `WHERE` filter + `LIMIT`       | `db.records.find({}).sort(...).to_list(500)`                                | `list_records()`                                |
| `<?php echo $row['name']; ?>` in a loop | React `.map(record => <Row record={record} />)`                          | `frontend/src/pages/Data.jsx`                    |
| Inline JS: `onsubmit="return validate()"` | React handler `onSubmit={submit}` + `validateRecord(values)`             | `Data.jsx`, `Login.jsx`, `Contact.jsx`           |
| DHTML calculator with `document.getElementById` | React `useState` + reactive recompute every render                  | `Data.jsx` GPA calculator                        |
| Apache/Nginx routing `.htaccess`     | FastAPI `APIRouter(prefix="/api")` + Kubernetes ingress                     | `server.py`                                     |
| `phpinfo()` / `var_dump()`           | `/api/health` and FastAPI `/docs` (Swagger)                                  | `server.py`                                     |
| `mysqldump` for backups              | `mongodump --uri="$MONGO_URL"`                                              | ops                                             |

## Side-by-side: a single login flow

**PHP (classic)**

```php
<?php
session_start();
$user = $db->prepare("SELECT id, password FROM users WHERE email = ?");
$user->execute([$_POST['email']]);
$row = $user->fetch();
if ($row && password_verify($_POST['password'], $row['password'])) {
    $_SESSION['user_id'] = $row['id'];
    header("Location: /data.php");
    exit;
}
echo "Invalid credentials";
```

**ARKIV (FastAPI)**

```python
@api.post("/auth/login", response_model=UserOut)
async def login(payload: LoginIn, response: Response):
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    set_auth_cookie(response, token)
    user.pop("password_hash"); user.pop("_id"); user["token"] = token
    return user
```

Same intent. Stronger validation. Async I/O. Auto-generated OpenAPI docs. Cookie still does the session work.

## Why the substitution still satisfies the brief

The brief tests four competencies:

1. **Server-side form processing** — both stacks do this; ARKIV uses Pydantic schema validation (stricter than typical PHP filters).
2. **Session management across pages** — ARKIV uses an `httpOnly` JWT cookie that travels with every request, just like a PHP `PHPSESSID` cookie.
3. **CRUD against a database** — Mongo collections and indexes provide the same primitives MySQL tables would: schema enforcement (via Pydantic), uniqueness (`unique=True` index on email), and ordered reads (`sort("created_at", -1)`).
4. **Responsive UI with JS interactivity** — React + Tailwind, plus a true client-side DHTML calculator with no full-page reloads.

If a strict PHP/MySQL deployment is mandatory, the mapping above is one-to-one: each route, field, and side-effect can be transliterated without changing the data model or page flow.
