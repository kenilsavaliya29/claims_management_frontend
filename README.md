# ClaimGuard — Insurance Claim Management Frontend

Modern React + Vite frontend for an Insurance Claim Management System, integrated with a Spring Boot JWT backend.

## Tech Stack

- React 19 + Vite 8
- React Router DOM
- Axios (JWT interceptors)
- Tailwind CSS v4
- Radix UI primitives (ShadCN-style components)
- Context API for authentication
- Sonner for toast notifications

## Getting Started

### Prerequisites

- Node.js 18+
- Spring Boot backend running at `http://localhost:8085`

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env` and set:

```
VITE_API_BASE_URL=http://localhost:8085
```

## Routes

| Route | Role | Description |
|-------|------|-------------|
| `/login` | Public | Sign in |
| `/register` | Public | Register |
| `/dashboard` | USER | User dashboard |
| `/claims/create` | USER | File new claim |
| `/claims/my` | USER | My claims list |
| `/claims/:claimId` | USER | Claim details |
| `/admin/dashboard` | ADMIN | Admin dashboard |
| `/admin/claims` | ADMIN | All claims + status updates |

## Auth

- JWT stored in `localStorage`
- Axios attaches `Authorization: Bearer <token>`
- 401 responses clear session and redirect to login

## Project Structure

```
src/
├── api/           # Axios instance & API modules
├── components/    # UI & shared components
├── context/       # AuthContext
├── hooks/         # useAuth
├── layouts/       # Auth & Dashboard layouts
├── pages/         # Route pages
├── routes/        # Protected & role routes
├── services/      # Error helpers
└── utils/         # Constants, storage, formatters
```
