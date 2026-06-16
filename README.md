# 🌐 Cyberpunk Developer Portfolio - Tiyas

<div align="center">
  
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
  
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![SwiperJS](https://img.shields.io/badge/SwiperJS-6332F6?style=for-the-badge&logo=swiper&logoColor=white)](https://swiperjs.com/)

  <p align="center">
    A premium, state-of-the-art cyberpunk developer portfolio website showcasing full-stack capabilities, MERN stack expertise, and competitive programming achievements with high-end, responsive animations.
  </p>

  <h4>
    <a href="#-key-features">Features</a> •
    <a href="#-directory-structure">Structure</a> •
    <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-environment-variables">Configuration</a>
  </h4>
</div>

---

## 🌟 Key Features

*   **⚡ SwiperJS Project Index Selector**
    *   Dynamic orientation support (vertical layout on desktop, horizontal scroll on mobile).
    *   Click-to-center slides (`slideToClickedSlide`) and mousewheel/trackpad gesture support.
    *   Auto-cycle project selection synced with an active progress bar slide indicator.
*   **🛸 3D Tilt Card & Interactive Sheen**
    *   Hovering over the active project details card tilts the frame in 3D perspective (`rotateX`/`rotateY`).
    *   A reactive radial laser glow sheen tracks mouse coordinates across the glassmorphism surface.
*   **🎭 Staggered Framer Motion Reveal**
    *   Smooth entry slide animations for the details card container when scrolled into view.
    *   Staggered entrance delays for image overlays, titles, description text, tech tags, and actions.
*   **📊 Live LeetCode Performance Graph**
    *   Real-time integration with LeetCode API to draw dynamic `Recharts` bar charts showing difficulty distributions and problem totals.
*   **🔐 Secure Admin Panel**
    *   JWT-authenticated admin pages to upload and manage skills, projects, experience, academics, and responses directly from a dashboard.

---

## 📂 Directory Structure

Here is the folder structure representing the modular MERN setup of the project:

```text
MyPortfolio/
├── src/
│   ├── app/                      # Next.js App Router Pages
│   │   ├── admin/                # Admin Panel Interface
│   │   ├── api/                  # Backend API Routes (Skills, Projects, Responses)
│   │   ├── login/                # Admin Authorization Page
│   │   ├── uploadProjects/       # Upload Dashboards for Admin
│   │   ├── globals.css           # Custom CSS variables & keyframe animations
│   │   ├── layout.tsx            # App Layout wrapper with custom cursor
│   │   └── page.tsx              # Homepage composition entry
│   │
│   ├── components/               # Reusable React UI Components
│   │   ├── about.tsx             # About section featuring Recharts Leetcode Stats
│   │   ├── projects.tsx          # SwiperJS menu and 3D tilting preview card
│   │   ├── contact.tsx           # Framer-motion contact form with email delivery
│   │   ├── footer.tsx            # Footer showing custom social icons grid
│   │   ├── social-icons.tsx      # SVG outline social icons (Github, LeetCode, X...)
│   │   └── cyber-background.tsx  # Interactive glowing grid backdrop
│   │
│   ├── lib/                      # Helper Scripts & Configurations
│   │   ├── auth.tsx              # JWT generation and verifying middleware
│   │   ├── dbConnect.ts          # MongoDB connection handler
│   │   └── uploadOnCloudinary.ts # Media assets Cloudinary helper
│   │
│   └── models/                   # Mongoose Database Models / Schemas
│       ├── academics.ts          # Schema for Academic listings
│       ├── experience.ts         # Schema for Professional experience
│       ├── project.ts            # Schema for Projects details
│       └── response.ts           # Schema for Contact Form Responses
```

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 | App Router, API endpoints, Turbopack compiling |
| **Styling** | Tailwind CSS v4 | Futuristic CSS layouts, glassmorphism, utilities |
| **Animations** | Framer Motion 12 | Staggered reveals, entrance transitions, text fades |
| **Carousel** | SwiperJS 11 | Projects index list selector |
| **Charts** | Recharts | Interactive bar/pie diagrams |
| **Database** | MongoDB & Mongoose | Document database holding projects, logs, and skills |
| **Hosting** | Cloudinary | Asset manager hosting high-res project previews |

---

## 🚀 Getting Started

<details>
<summary><b>1. Prerequisites</b></summary>
Make sure you have Node.js (v18.0.0 or higher) and npm installed on your local system:
```bash
node -v
npm -v
```
</details>

<details>
<summary><b>2. Repository Setup & Dependencies</b></summary>
Clone the repository and install packages:
```bash
git clone https://github.com/Tiyas04/MyPortfolio.git
cd MyPortfolio
npm install --legacy-peer-deps
```
*Note: Using `--legacy-peer-deps` resolves React 19 dependency queries smoothly.*
</details>

<details>
<summary><b>3. Run Development Environment</b></summary>
Launch the local Hot-Module-Replacement (HMR) development server:
```bash
npm run dev
```
Open your browser to [http://localhost:3000](http://localhost:3000) to view the application.
</details>

<details>
<summary><b>4. Production Build</b></summary>
Test code compilation and compile optimized static pages for deployment:
```bash
npm run build
```
</details>

---

## ⚙️ Environment Variables

Set up a `.env` file in your root folder. Below is the reference checklist for configurations:

| Parameter | Recommended Format | Purpose |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://...` | Connection URL for MongoDB Atlas Database |
| `EMAIL_USER` | `your-email@gmail.com` | Email address forwarding form alerts |
| `EMAIL_PASS` | `xxxx xxxx xxxx xxxx` | Secure app password for mail auth |
| `EMAIL_RECEIVER` | `dest-email@gmail.com` | Target inbox receiving contact alerts |
| `ADMIN_USERNAME`| `admin` | Admin dashboard identifier login credential |
| `ADMIN_PASSWORD`| `secure-admin-pass` | Admin dashboard verification credential |
| `JWT_SECRET` | `alphanumeric-secret-key` | Token hash for authentication storage |

---

## 🔧 Customization Options

### Social Links
To update your personal social links:
1. Open [`footer.tsx`](file:///c:/Users/jhuma/OneDrive/Desktop/My%20Folder/My%20codes/MyPortfolio/MyPortfolio/src/components/footer.tsx) and [`contact.tsx`](file:///c:/Users/jhuma/OneDrive/Desktop/My%20Folder/My%20codes/MyPortfolio/MyPortfolio/src/components/contact.tsx).
2. Edit the placeholder URLs (e.g. `https://x.com/your_handle`) to link directly to your social profile pages.

### LeetCode API Statistics
To load your own programming data:
1. Open [`about.tsx`](file:///c:/Users/jhuma/OneDrive/Desktop/My%20Folder/My%20codes/MyPortfolio/MyPortfolio/src/components/about.tsx).
2. Update the fetch endpoint username from `Tiyas04` to your personal LeetCode username:
   ```typescript
   fetch("https://alfa-leetcode-api.onrender.com/your_username/profile")
   ```
