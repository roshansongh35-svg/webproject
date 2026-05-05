# ARKIV — System Architecture

## High-level diagram

```mermaid
flowchart LR
    subgraph Browser["Browser (React 19 SPA)"]
        direction TB
        H[Home /]
        A[About /about]
        F[Features /features]
        D["Data /data 🔒"]
        L[Login /login]
        C[Contact /contact]
        AUTH[(AuthContext<br/>+ localStorage)]
        CALC[[GPA Calculator<br/>DHTML]]
    end

    subgraph Server["FastAPI Backend (port 8001, prefix /api)"]
        direction TB
        ROUTES[/HTTP routes/]
        AUTH_R[/auth/register · /auth/login<br/>/auth/me · /auth/logout/]
        REC_R[/records POST · GET<br/>records/public/]
        STAT_R[/health · /stats · /contact/]
        DEP[get_current_user<br/>JWT verify]
    end

    subgraph DB["MongoDB"]
        U[(users<br/>indexed: email)]
        R[(records<br/>indexed: created_at)]
        M[(messages)]
    end

    H -->|axios| ROUTES
    A -->|axios| ROUTES
    F -->|axios| ROUTES
    D -->|axios + cookie| ROUTES
    L -->|POST login/register| ROUTES
    C -->|POST contact| ROUTES

    AUTH <-->|httpOnly cookie<br/>+ Bearer token| ROUTES
    D -.uses.-> CALC

    ROUTES --> AUTH_R
    ROUTES --> REC_R
    ROUTES --> STAT_R
    AUTH_R --> DEP
    REC_R --> DEP

    AUTH_R --> U
    REC_R --> R
    STAT_R --> M
    STAT_R --> U
    STAT_R --> R
```

## Page → endpoint matrix

| Page         | Public? | Reads                              | Writes                          |
| ------------ | ------- | ---------------------------------- | ------------------------------- |
| Home `/`     | ✅       | `GET /api/stats`, `GET /api/records/public` | —                          |
| About        | ✅       | —                                  | —                               |
| Features     | ✅       | —                                  | —                               |
| Login        | ✅       | —                                  | `POST /api/auth/login` or `/register` |
| Data 🔒      | Auth    | `GET /api/auth/me`, `GET /api/records`, `GET /api/stats` | `POST /api/records`     |
| Contact      | ✅       | —                                  | `POST /api/contact`             |
| (Navbar)     | both    | `GET /api/auth/me` (on mount)      | `POST /api/auth/logout`         |

## Authentication flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React
    participant API as FastAPI
    participant DB as MongoDB

    U->>FE: enters email + password on /login
    FE->>API: POST /api/auth/login
    API->>DB: users.find_one({email})
    DB-->>API: user doc
    API->>API: bcrypt.checkpw(...)
    API-->>FE: 200 + Set-Cookie: access_token (httpOnly)<br/>+ {token, user}
    FE->>FE: setUser(...) + localStorage.setItem("arkiv_token")
    FE->>U: redirect to /data
    U->>FE: navigates around (Home, Contact)
    FE->>API: every request → cookie + Authorization: Bearer
    API->>API: jwt.decode → get_current_user
    API-->>FE: user data
    U->>FE: clicks Logout
    FE->>API: POST /api/auth/logout
    API-->>FE: clears cookie
    FE->>FE: localStorage.removeItem + setUser(false)
```

## Tech choices

| Layer    | Choice                       | Why                                              |
| -------- | ---------------------------- | ------------------------------------------------ |
| UI       | React 19 + Tailwind          | Component model + utility-first responsive CSS    |
| Routing  | React Router 7               | SPA navigation matching the 6-page brief         |
| Auth     | JWT (HS256) in httpOnly cookie | Cross-page session, XSS-resistant                |
| Backend  | FastAPI + Pydantic           | Server-side validation + auto OpenAPI docs       |
| DB       | MongoDB (motor async driver) | Document model fits flexible academic records    |
| Hashing  | bcrypt                       | Industry-standard password hashing               |
| Icons    | Phosphor                     | Sharp, technical line-icons (no emoji)           |
| Fonts    | Cabinet Grotesk + IBM Plex   | Editorial / Swiss aesthetic, not generic Inter   |
