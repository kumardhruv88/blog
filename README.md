# TechScribe — Modern Tech Blog Platform

A full-stack tech blog platform built with React, Vite, Express, and Supabase —
featuring a warm, professional UI, rich content creation, and an integrated
research paper explorer.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

- **Blog Engine** — Create, edit, and publish rich Markdown posts with live
  preview, syntax highlighting, and image uploads.
- **Research Papers** — Browse 90+ curated landmark papers across 9 fields or
  search millions via the CORE API.
- **Code Playground** — Interactive code editor powered by Monaco with live
  preview.
- **User Dashboard** — Analytics, post management, bookmarks, and profile
  customization.
- **Admin Panel** — Full admin dashboard with user/post/tag management and
  analytics.
- **Authentication** — Secure auth via Clerk with role-based access control.
- **Modern UI** — Warm light palette, glassmorphism effects, Framer Motion
  animations, and fully responsive design.

---

## 🛠️ Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 19, Vite 7, Tailwind CSS 4, Framer Motion |
| Backend  | Express.js, Node.js                             |
| Database | Supabase (PostgreSQL)                           |
| Auth     | Clerk                                           |
| Storage  | Cloudinary (image uploads)                      |
| Charts   | Recharts                                        |
| Editor   | Monaco Editor, React Markdown                   |

---

## 📁 Project Structure

```
blog/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── blog/       # Blog-specific components
│   │   │   ├── common/     # Button, Card, Input, Badge
│   │   │   ├── home/       # Hero, CategoryCarousel, etc.
│   │   │   └── layout/     # Navbar, Footer, UserLayout
│   │   ├── data/           # Curated research papers dataset
│   │   ├── pages/          # Route pages
│   │   ├── styles/         # Global CSS, glassmorphism
│   │   ├── routes.jsx      # App routing
│   │   └── App.jsx         # Root component
│   ├── public/             # Static assets
│   └── index.html          # Entry HTML
│
├── server/                 # Express backend
│   ├── config/             # DB & app config
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, validation, upload
│   ├── routes/             # API route definitions
│   ├── utils/              # Helpers
│   ├── schema.sql          # Database schema
│   └── index.js            # Server entry point
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
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

Run `server/schema.sql` in your Supabase SQL editor to create all necessary
tables.

### 5. Start development servers

```bash
# Terminal 1 — Client
cd client
npm run dev

# Terminal 2 — Server
cd server
npm run dev
```

The client runs at `http://localhost:5178` and the server at
`http://localhost:5000`.

---

## 📸 Pages

| Page            | Route            | Description                       |
| --------------- | ---------------- | --------------------------------- |
| Home            | `/`              | Hero, categories, featured posts  |
| Blog            | `/blog`          | Filterable blog listing           |
| Post Detail     | `/blog/:slug`    | Full article with TOC & comments  |
| Research Papers | `/research`      | Curated + CORE API paper search   |
| Code Playground | `/playground`    | Monaco-based code editor          |
| Dashboard       | `/dashboard`     | User analytics & post management  |
| Create Post     | `/create-post`   | Markdown editor with live preview |
| Profile         | `/profile/:user` | Public user profile               |
| About           | `/about`         | About the platform                |
| Contact         | `/contact`       | Contact form                      |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ☕ by <strong>Dhruv</strong>
</p>
