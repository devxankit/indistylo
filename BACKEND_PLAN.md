# IndiStylo Technical Specification & Backend Implementation Plan

## 1. Frontend Analysis Report

### 1.1 Architecture Overview
The frontend is a React 19 application built with Vite and TypeScript, following a module-based architecture:
- **User Module**: Customer-facing app for browsing and booking services.
- **Vendor Module**: Portal for salon owners and freelancers to manage business.
- **Admin Module**: Centralized dashboard for system oversight and management.
- **State Management**: Uses Zustand for modular state (Cart, User, Vendor, Admin, etc.).
- **Styling**: Tailwind CSS with a consistent dark-themed UI.

### 1.2 Module Breakdown

#### Customer (User Module)
- **Core Flows**: Service Discovery -> Booking -> Payment -> Management.
- **Key Data**: Salons, Services, Time Slots, Professionals, Cart, User Profile, Addresses.
- **API Requirements**:
  - `GET /api/services`: List services (At-Salon/At-Home).
  - `GET /api/shops/:id`: Salon/Vendor details.
  - `POST /api/bookings`: Create appointment.
  - `GET /api/bookings`: User appointment history.
  - `POST /api/reviews`: Submit service feedback.

#### Vendor Module
- **Core Flows**: Onboarding -> Schedule Management -> Booking Fulfillment -> Earnings.
- **Key Data**: Business Profile, Service Catalog, Availability, Client List, Revenue Stats.
- **API Requirements**:
  - `POST /api/vendor/register`: Onboarding flow.
  - `GET /api/vendor/stats`: Analytics for dashboard.
  - `PATCH /api/vendor/schedule`: Update availability/breaks.
  - `GET /api/vendor/bookings`: Manage incoming requests.

#### Admin Module
- **Core Flows**: Vendor Verification -> Content Moderation -> Financial Oversight.
- **Key Data**: Global Metrics, Vendor Applications, Payout Requests, System Content (Banners).
- **API Requirements**:
  - `GET /api/admin/dashboard`: System-wide stats.
  - `GET /api/admin/vendors/pending`: Approval queue.
  - `POST /api/admin/banners`: Promotional content management.

---

## 2. Backend Design Specification

### 2.1 Unified Authentication System
- **Method**: Phone-based OTP Authentication.
- **Role-Based Access Control (RBAC)**:
  - Roles: `CUSTOMER`, `VENDOR`, `ADMIN`.
  - JWT Claims: `{ userId, role, businessId? }`.
  - Middleware: `requireAuth`, `requireRole(['ADMIN', 'VENDOR'])`.

### 2.2 Database Schema (Entity Relationship)
- **User Table**: Centralized identity for all roles.
- **Vendor Profile**: Extended data for vendor users (Business name, status, rating).
- **Service Table**: Categorized offerings linked to vendors.
- **Booking Table**: Connects Customer, Vendor, and Service.
- **Schedule Table**: Time-slot availability management.
- **Transaction Table**: Tracking payments and vendor payouts.

### 2.3 Shared Services
- **Notification Service**: SMS/Push notifications for booking updates.
- **Payment Service**: Integration with Razorpay/Stripe for secure transactions.
- **Image Service**: Cloudinary/S3 for profile and gallery images.

---

## 3. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Initialize Backend (Node.js/Express or NestJS).
- [ ] Database Schema Migration.
- [ ] Implement Auth Service (JWT + OTP).
- [ ] Shared Middleware (Error handling, Validation).

### Phase 2: Customer Core (Weeks 3-4)
- [ ] Service Listing & Filtering API.
- [ ] Booking Engine (Slot validation & reservation).
- [ ] User Profile & Address management.

### Phase 3: Vendor Ecosystem (Weeks 5-6)
- [ ] Vendor Onboarding & Verification flow.
- [ ] Schedule/Availability API.
- [ ] Service Catalog Management.

### Phase 4: Admin & Finance (Weeks 7-8)
- [ ] Admin Statistics Engine.
- [ ] Vendor Approval Workflow.
- [ ] Commission & Payout processing.

### Phase 5: Integration & Quality (Weeks 9-10)
- [ ] Frontend-Backend connectivity for all modules.
- [ ] Payment Gateway Integration.
- [ ] End-to-End Testing & Security Audit.

---

## 4. Testing & QA Strategy
- **Unit Testing**: Jest/Vitest for business logic and utility functions.
- **Integration Testing**: Supertest for API endpoint verification.
- **E2E Testing**: Playwright/Cypress for critical journeys (e.g., Booking a service).
- **Security**: Role isolation testing, SQL injection prevention, and Rate limiting.
