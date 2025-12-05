<div align="center">

<img src="https://res.cloudinary.com/de4uhtgmb/image/upload/v1764963031/Untitled_design_z8fexl.jpg" alt="Sushil.dev Banner" width="100%" />

# 🎮 Sushil.dev — Retro-Modern Developer Portfolio

**A pixel-perfect, performance-focused portfolio with a gamer aesthetic and liquid glass UI**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-4ADE80?style=for-the-badge)](https://sushil.dev)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Made with React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[✨ Features](#-features) • [🚀 Live Demo](https://sushil.dev) • [💻 Tech Stack](#-tech-stack) • [📦 Installation](#-installation) • [🎨 Screenshots](#-screenshots)

</div>

---

## 🎯 About

**Sushil.dev** is a high-performance, retro-inspired developer portfolio combining modern web technologies with a nostalgic gamer aesthetic. Built with React, TypeScript, and Tailwind CSS, it features smooth animations, liquid glass morphism, interactive UI elements, and a fully functional admin dashboard for content management.

---

## ✨ Features

### 🎨 Design & UX

- **Liquid Glass Morphism** — Blur effects, dynamic highlights, SVG distortion filters  
- **Retro Gaming Theme** — Pixel fonts, CRT scanlines, neon colors, arcade loading screens  
- **Responsive Mobile-First** — Optimized layout using `dvh` viewport units  
- **Smooth Animations** — Hover transitions, scroll-based reveals  
- **Cursor Gravity Effect** — UI reacts to cursor movement  

---

### 🛠️ Functionality

- **Dynamic Project Showcase** with filters and details  
- **Admin Dashboard** with secure CRUD  
- **Firebase Integration** for real-time data and auth  
- **Cloudinary CDN** for image delivery  
- **SEO Optimized** (OG tags, Twitter cards, metadata)  
- **PWA Ready** with service worker  

---

### 🔥 Performance

- **Lazy Loading** for routes & images  
- **Code Splitting** (Vite optimized)  
- **Reduced animation load on mobile**  
- **Lighthouse Score:** 95+  

---

## 💻 Tech Stack

<div align="center">

### Core Technologies

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Backend & Services

![Firebase](https://img.shields.io/badge/Firebase-11.0.2-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)

### Libraries & Tools

![React Router](https://img.shields.io/badge/React_Router-6.27.0-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-0.454.0-F56565?style=for-the-badge)
![PostCSS](https://img.shields.io/badge/PostCSS-8.4.47-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)

</div>

---

## 🎨 Screenshots

<div align="center">

### 🏠 Project Section  
<img src="https://res.cloudinary.com/de4uhtgmb/image/upload/v1764966678/Screenshot_2025-12-06_015954_p0rwj1.png" alt="Hero Section" width="80%" />

### 🎯 Skills Matrix  
<img src="https://raw.githubusercontent.com/sushil930/Sushil.dev/refs/heads/main/icons/screenshots/skills-grid.png" alt="Skills Matrix" width="80%" />

### 🎮 Admin Dashboard  
<img src="https://raw.githubusercontent.com/sushil930/Sushil.dev/refs/heads/main/icons/screenshots/admin%20panal.png" alt="Admin Dashboard" width="80%" />

</div>

---

## 📦 Installation

### Prerequisites

- Node.js 18+  
- Firebase Account  
- Cloudinary Account  

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sushil930/Sushil.dev.git
cd Sushil.dev
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Setup

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name

# Admin Password (hash recommended in production)
VITE_ADMIN_PASSWORD=your_secure_password

# Contact Email
VITE_CONTACT_EMAIL=hello@sushil.dev
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5️⃣ Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```
2. **Deploy:**

   ```bash
   vercel
   ```
3. **Add Environment Variables** in the Vercel dashboard under **Settings → Environment Variables**.

### Deploy to Netlify

1. **Build the project:**

   ```bash
   npm run build
   ```
2. **Deploy the `dist` folder** via Netlify CLI or drag-and-drop in the Netlify dashboard.
3. **Set environment variables** in **Site settings → Build & deploy → Environment**.

---

## 📁 Project Structure

```
Sushil.dev/
├── api/                    # Serverless API endpoints
├── components/             # React components
│   ├── Hero.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   ├── LiquidGlassCard.tsx
│   └── ...
├── pages/                  # Route pages
│   ├── ProjectPage.tsx
│   ├── AdminDashboard.tsx
│   └── Login.tsx
├── utils/                  # Helper functions
│   ├── dataManager.ts
│   ├── firebaseService.ts
│   └── cloudinary.ts
├── icons/                  # Favicons and OG images
├── data/                   # Static data (projects, skills)
├── src/                    # Styles and entry point
│   └── index.css
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
└── package.json
```

---

## 🎮 Admin Dashboard

Access the admin panel at `/login` with your configured password. Features:

- ✏️ Add/Edit/Delete projects
- 🛠️ Manage skills with icons and proficiency levels
- 🖼️ Upload images to Cloudinary
- 🔒 Firebase authentication

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Lucide Icons](https://lucide.dev/)** — Beautiful, consistent icons
- **[Firebase](https://firebase.google.com/)** — Backend infrastructure
- **[Cloudinary](https://cloudinary.com/)** — Image optimization
- **[Press Start 2P Font](https://fonts.google.com/specimen/Press+Start+2P)** — Retro pixel font

---

<div align="center">

### 💼 Connect with Me

[![Portfolio](https://img.shields.io/badge/Portfolio-sushil.dev-4ADE80?style=for-the-badge)](https://sushil.dev)
[![GitHub](https://img.shields.io/badge/GitHub-sushil930-181717?style=for-the-badge&logo=github)](https://github.com/sushil930)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/sushil930)

**⭐ Star this repo if you found it helpful!**

</div>
