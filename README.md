# Personal Developer Portfolio

A modern, responsive, and interactive personal developer portfolio built with React, Vite, and Tailwind CSS. This application showcases projects, skills, services, and professional experience with high-quality visual components and seamless interactivity.

## ✨ Features

*   **Interactive Hero Section:** Engaging introduction with a stylized profile card, gradient accents, and social links.
*   **Dynamic Canvas Background:** Features a custom HTML5 canvas particle and atomic network background that reacts to cursor/touch movements.
*   **Projects Matrix:** Clean grid showcasing featured projects with key metrics, tech stack tags, and links.
*   **Services & Skills:** Highlights core competencies, development services, and tool proficiency.
*   **Responsive Design:** Fully fluid layout that adapts beautifully to desktop, tablet, and mobile viewports.
*   **Centralized Data:** Easily update personal information, projects, and skills through a single `src/data.ts` file.

## 🛠️ Tech Stack

*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Language:** TypeScript

## 🚀 Getting Started

To run this project locally, ensure you have Node.js (v18+) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will start, and the development server will typically be available at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be output to the `dist` directory.

## 📝 Customization

You can personalize this portfolio without touching the core component logic. Simply open the `src/data.ts` file and update the following objects:

*   `personalInfo`: Update your name, greeting, bio, contact email, and avatar.
*   `services`: Define what professional services you offer.
*   `projects`: Add or remove your case studies and portfolio works.
*   `skills` & `allSkillsList`: Adjust your tech stack proficiency and experience levels.
*   `experienceTimeline`: Detail your professional work history.
*   `socialLinks`: Connect your GitHub, LinkedIn, Twitter/X, and other profiles.
