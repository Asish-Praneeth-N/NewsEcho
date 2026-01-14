# NewsEcho - Newsletter Management System

NewsEcho is a robust, production-ready SaaS platform for managing, publishing, and reading newsletters. It features a comprehensive role-based access control system (Super Admin, Admin, User), real-time community discussions, and detailed analytics.

## 🚀 Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend / Database**: Firebase (Firestore & Authentication)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: Recharts
- **Content**: React Markdown

## ✨ Key Features

### 👤 User Features
- **Library**: Browse and read published newsletters.
- **Community Interaction**: 
  - Global discussion feed.
  - Per-newsletter scoped discussions.
  - **Reply System**: Tag specific users in replies.
  - **Timed Editing**: Users can edit comments within **3 minutes** of posting.
- **Subscriptions**: Subscribe to favorite authors/newsletters.
- **Bookmarks**: Save articles for later reading.
- **Profile**: Manage personal details and subscriptions.

### 🛡️ Admin & Super Admin Features
- **Dashboard**: High-level overview of platform stats.
- **Newsletter Management**: Create, edit, and publish newsletters with Markdown support.
- **Analytics**: Visual data on user growth, reading trends, and subscription rates.
- **Role Management** (Super Admin): Promote/demote users and manage access levels.

## 🏗️ Project Architecture

```
newsletterms/
├── app/
│   ├── admin/             # Admin dashboard & newsletter editor
│   ├── community/         # Global discussion board page
│   ├── components/        # Reusable UI components
│   │   ├── community/     # DiscussionBoard logic (Reply/Edit system)
│   │   └── layout/        # Navbars, Sidebars (User/Admin/SuperAdmin)
│   ├── dashboard/         # User personalized dashboard
│   ├── google-analytics/  # Analytics integration
│   ├── login/ & signup/   # Authentication pages
│   ├── newsletter/        # Dynamic reader view [slug]
│   ├── newsletters/       # "The Library" - Newsletter explorer
│   ├── profile/           # User profile management
│   ├── subscriptions/     # User subscriptions list
│   └── super-admin/       # Advanced platform controls
├── context/
│   └── AuthContext.tsx    # Global auth state & role handling
├── lib/
│   └── firebase.ts        # Firebase configuration
└── firestore.rules        # Database security & permissions
```

### Security & Roles
The application uses a strict Role-Based Access Control (RBAC) system enforced via **Firestore Rules**:

1.  **Super Admin**: Full access to all data, ability to change user roles.
2.  **Admin**: Can create/edit newsletters and view analytics.
3.  **User**: Can read published content, subscribe, bookmark, and participate in discussions.

*Note: Determining `isAdmin` in Firestore Rules safely handles cases where a user profile document might not exist yet.*

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (Latest LTS recommended)
- A Firebase project with Firestore and Authentication enabled.

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Firebase credentials:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Running Locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Usage Guide

- **First Run**: The first user usually needs to be manually promoted to `super_admin` in the Firestore console `users` collection.
- **Community**: Validated posts are stored in `community_posts`. Edits are strictly time-gated by server rules.
- **Newsletters**: Stored in `newsletters` collection. Only `status: "published"` items are visible to Users.

---
Built with ❤️ using Next.js & Firebase.
