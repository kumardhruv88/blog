<div align="center">

<img src="https://img.shields.io/badge/TECHSCRIBE-Modern%20Tech%20Blog-1A1A2E?style=for-the-badge&logoColor=white" alt="TechScribe" height="36"/>

# TechScribe

### A Modern Full-Stack Tech Blog Platform

*Write. Explore. Build.*

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## Overview

**TechScribe** is a full-stack tech blog platform built with React, Vite, Express, and Supabase. It combines a rich content creation experience with a built-in research paper explorer, an interactive code playground, and a comprehensive admin panel — all wrapped in a warm, responsive UI.

---

## Features

| | Feature | Description |
|---|---|---|
| ✍️ | **Blog Engine** | Create, edit, and publish Markdown posts with live preview, syntax highlighting, and image uploads |
| 🔬 | **Research Papers** | Browse 90+ curated landmark papers across 9 fields or search millions via the CORE API |
| 💻 | **Code Playground** | Interactive Monaco-powered editor with live preview |
| 📊 | **User Dashboard** | Analytics, post management, bookmarks, and profile customization |
| 🛡️ | **Admin Panel** | Full dashboard with user, post, and tag management |
| 🔐 | **Authentication** | Secure auth via Clerk with role-based access control |
| 🎨 | **Modern UI** | Warm light palette, glassmorphism effects, Framer Motion animations, fully responsive |

---

## Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square&logo=react&logoColor=white)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)

**Database & Services**

![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)

---

## Project Structure

```
blog/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── blog/           # Blog-specific components
│   │   │   ├── common/         # Button, Card, Input, Badge
│   │   │   ├── home/           # Hero, CategoryCarousel, etc.
│   │   │   └── layout/         # Navbar, Footer, UserLayout
│   │   ├── data/               # Curated research papers dataset
│   │   ├── pages/              # Route-level page components
│   │   ├── styles/             # Global CSS & glassmorphism
│   │   ├── routes.jsx          # App routing
│   │   └── App.jsx             # Root component
│   ├── public/                 # Static assets
│   └── index.html              # Entry HTML
│
└── server/                     # Express backend
    ├── config/                 # DB & app config
    ├── controllers/            # Route handlers
    ├── middleware/             # Auth, validation, upload
    ├── routes/                 # API route definitions
    ├── utils/                  # Helper functions
    ├── schema.sql              # Database schema
    └── index.js                # Server entry point
```

---

## Getting Started

### Prerequisites

- ![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?style=flat-square&logo=node.js&logoColor=white)
- A [Supabase](https://supabase.com) project
- A [Clerk](https://clerk.com) application
- A [Cloudinary](https://cloudinary.com) account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/blog.git
cd blog
```

### 2. Setup the client

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

### 3. Setup the server

```bash
cd ../server
npm install
```

Create `server/.env`:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLERK_SECRET_KEY=your_clerk_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Setup the database

Run `server/schema.sql` in your Supabase SQL editor to initialise all required tables.

### 5. Start development servers

```bash
# Terminal 1 — Client
cd client && npm run dev

# Terminal 2 — Server
cd server && npm run dev
```

| Service | URL |
|---|---|
| Client | `http://localhost:5178` |
| Server | `http://localhost:5000` |

---

## Pages & Routes

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, categories, featured posts |
| Blog | `/blog` | Filterable blog listing |
| Post Detail | `/blog/:slug` | Full article with TOC & comments |
| Research Papers | `/research` | Curated + CORE API paper search |
| Code Playground | `/playground` | Monaco-based code editor |
| Dashboard | `/dashboard` | User analytics & post management |
| Create Post | `/create-post` | Markdown editor with live preview |
| Profile | `/profile/:user` | Public user profile |
| About | `/about` | About the platform |
| Contact | `/contact` | Contact form |

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

*Built for developers who love to write.*

</div>
