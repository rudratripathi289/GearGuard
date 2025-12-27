# Equipment Maintenance Tracker

A workflow-driven system for equipment maintenance and task tracking, built with React, Vite, and Tailwind CSS.

## Features

- **Equipment Management**: Register and manage equipment with details like category, location, and status
- **Maintenance Requests**: Create and track maintenance requests linked to equipment
- **Kanban Board**: Visual workflow tracking with drag-and-drop status updates
- **Role-Based Access**: Support for Admin, Technician, and User roles
- **Assignment System**: Assign technicians to requests and track progress
- **Comments & Updates**: Add progress comments and updates to requests
- **Status Workflow**: New → Assigned → In Progress → Under Review → Completed

## Tech Stack

- React 18
- Vite
- React Router
- Axios (with mocked API layer)
- Tailwind CSS
- JavaScript

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Credentials

The application uses mocked authentication. You can login with:

- **Admin**: `admin@example.com` (any password)
- **Technician**: `john@example.com` (any password)
- **User**: `user@example.com` (any password)

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── forms/           # Form components
│   ├── kanban/          # Kanban board components
│   ├── layout/          # Layout components (Header, ProtectedRoute)
│   └── modals/          # Modal components
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API service layer (mocked)
├── types/               # Type definitions and constants
├── utils/               # Utility functions and constants
├── App.jsx              # Main app component with routing
└── main.jsx             # Entry point
```

## Routes

- `/login` - Login page
- `/dashboard` - Dashboard with overview
- `/equipment` - Equipment list
- `/equipment/:id` - Equipment details
- `/requests` - Maintenance requests list
- `/requests/new` - Create new request
- `/requests/:id` - Request details
- `/kanban` - Kanban board view

## Workflow

1. **Equipment Registration**: Equipment must be registered first
2. **Request Creation**: Users create maintenance requests for equipment
3. **Assignment**: Admins assign technicians to requests
4. **Progress Tracking**: Technicians update status and add comments
5. **Review & Closure**: Admins review and approve completed work

## Notes

- All API calls are mocked using a service layer
- Data persists in memory during the session
- Drag and drop uses HTML5 Drag and Drop API
- The application is fully responsive and mobile-friendly

