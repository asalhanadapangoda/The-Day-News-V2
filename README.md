# [Project Report: The Day News Global V2]

A comprehensive overview of the technical architecture, security protocols, performance optimizations, and user experience enhancements implemented in The Day News Global V2.

## 🚀 Core Technologies
The platform is built using a modern, scalable **MERN** stack (MongoDB, Express, React, Node.js) with a focus on speed and security.

- **Frontend**: 
  - **React 18** & **Vite**: For ultra-fast development and optimized production builds.
  - **Tailwind CSS v4**: Utilizing the latest CSS utility framework for professional, high-performance styling.
  - **Lucide React**: For a consistent, high-quality icon system.
  - **React Hook Form & Zod**: For robust form management and validation.
- **Backend**:
  - **Node.js** & **Express**: Providing a fast, non-blocking API layer.
  - **MongoDB (Mongoose)**: A flexible NoSQL database for content storage.
  - **Groq SDK**: Powering advanced AI features via the Llama 3 model.
- **Media**:
  - **Cloudinary**: Integrated for secure, cloud-based image storage and transformation.

---

## 🏗️ Project Structure
The repository is organized into two primary micro-services for better maintainability and separation of concerns.

```text
The-Day-News-V2/
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Skeleton, AIChatBot, etc.)
│   │   ├── pages/       # Main view logic (Home, Programs, Articles)
│   │   │   └── admin/   # Dedicated Admin Management suite
│   │   └── services/    # API abstraction layer (Axios)
└── server/              # Backend (Node + Express)
    ├── config/          # Database & configuration settings
    ├── controllers/     # Business logic layer
    ├── models/          # MongoDB schemas (Article, Program, Episode, Ads)
    └── routes/          # API endpoint definitions
```

---

## 🔐 Security & special features
We prioritize data integrity and administrator security with a multi-layered approach:

- **JWT Authentication**: Secure, token-based sessions for admin access.
- **Password Hashing**: Industry-standard **Bcrypt** for protecting user credentials.
- **Security Headers**: **Helmet.js** implemented to prevent common web vulnerabilities (XSS, Clickjacking).
- **Rate Limiting**: Protects against Brute-Force and DDoS attacks by limiting requests from a single IP.
- **Admin Auto-Logout**: A special security feature that automatically logs out administrators after 15 minutes of inactivity to prevent unauthorized access.
- **Mongo Sanitize**: Prevents NoSQL injection attacks by stripping sensitive operators from incoming data.

---

## ⚡ Performance & Scalability
Designed to handle high traffic and deep content libraries efficiently.

- **Database Indexing**: 
  - Optimized queries for articles (indexed by `category`, `status`, and `publishDate`).
  - Unique-key indexing for `slugs` to ensure fast URL resolution.
- **Asset Optimization**:
  - **Image Lazy Loading**: Implemented across all grids to prioritize loading content that is currently visible to the user.
  - **Cloudinary Dynamic Resizing**: Ensures users only download the specific image size needed for their device.
- **Perceived Performance**:
  - **Skeleton Loaders**: Custom animated pulse placeholders replace generic loading spinners, reducing layout shift and making the site feel significantly faster.

---

## 🎨 User Experience (UX) Highlights
A premium design system focused on engagement and accessibility.

- **Premium Dark Mode**: A sleek, high-contrast design using glassmorphism and modern typography for an "Elite" feel.
- **AI Chat Assistant**: A special **Groq-powered** Llama 3 chatbot that helps users navigate the site and find news in real-time.
- **Interactive Multimedia**:
  - **Instant Video Modals**: Users can watch episodes without leaving the current page.
  - **Poster-Grid Layout**: High-impact vertical posters for programs, mirroring modern streaming services.
- **Admin Workflow**: Streamlined content management with one-click uploads and hidden technical fields (like complex URL strings).

---

> [!NOTE]
> This project is optimized for both local news delivery and a global audience with a focus on Sri Lankan achievements and innovations.
