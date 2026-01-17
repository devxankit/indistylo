# IndiStylo: Detailed Backend Implementation Roadmap (100% Completion)

This document outlines the granular steps required to transition the backend from its current state (~50%) to a fully production-ready system (100%).

---

## Phase 1: Security & Identity Hardening
*Objective: Replace mocks with production-grade security and authentication flows.*

- [ ] **1.1 Real OTP Integration**
  - Integrate Twilio or Fast2SMS API.
  - Implement `sendOtp` and `verifyOtp` logic in `auth.service.ts`.
  - Add OTP expiration (5-10 mins) using Redis or a `temp_otp` field with TTL.
- [ ] **1.2 Refresh Token Rotation**
  - Update `generateToken.ts` to issue both Access and Refresh tokens.
  - Implement `/api/auth/refresh` endpoint.
  - Securely store refresh tokens in HTTP-only cookies.
- [ ] **1.3 Password & Account Recovery**
  - Implement "Forgot Password" flow for Admin/Vendor (Email-based).
  - Add email verification for new Admin/Vendor registrations.
- [ ] **1.4 API Security & Rate Limiting**
  - Implement `express-rate-limit` for sensitive routes (Login, OTP).
  - Configure CORS for production domains.
  - Sanitize all incoming data using `express-mongo-sanitize`.

---

## Phase 2: Advanced Booking & Scheduling Engine
*Objective: Ensure 100% reliability in appointments and resource allocation.*

- [ ] **2.1 Intelligent Slot Validation**
  - Create a utility to calculate available slots based on `Schedule` and existing `Bookings`.
  - Implement strict validation in `createBooking` to prevent double-booking.
  - Handle timezone conversions for cross-region service providers.
- [ ] **2.2 Professional/Staff Management**
  - Create `Staff` model (or extend `User` with a `PROFESSIONAL` role).
  - Link specific staff members to services they can perform.
  - Implement staff-specific availability overrides.
- [ ] **2.3 Concurrency & Locking**
  - Use MongoDB transactions or a locking mechanism to handle simultaneous booking attempts for the same slot.
- [ ] **2.4 User Profile Completion**
  - Implement `updateAddress` API in `user.controller.ts`.
  - Add logic for "Favorite Salons" and "Past Professionals".

---

## Phase 3: Payment Gateway & Financial Systems
*Objective: Automate the entire revenue lifecycle from collection to payout.*

- [ ] **3.1 Razorpay Integration**
  - Implement `createOrder` API for frontend checkout.
  - Implement a robust Webhook handler to listen for `payment.captured` and `payment.failed`.
  - Implement Signature Verification for all payment callbacks.
- [ ] **3.2 Commission & Payout Engine**
  - Implement logic to calculate net vendor earnings: `Price - (Price * Commission%) - GST`.
  - Automated Payout Request generation when a booking is marked `completed`.
  - Admin dashboard for manual/automated payout approval.
- [ ] **3.3 Refund Management**
  - Implement `initiateRefund` logic for bookings cancelled within the allowed window.
  - Handle partial refunds for multi-service bookings.

---

## Phase 4: Media, Notifications & Infrastructure
*Objective: Build a responsive system that communicates effectively with users.*

- [ ] **4.1 Cloud Media Management**
  - Integrate Cloudinary SDK.
  - Create a shared utility for uploading salon galleries, profile pictures, and verification documents.
  - Implement image optimization and auto-resizing.
- [ ] **4.2 Unified Notification Service**
  - **Push**: Integrate Firebase Cloud Messaging (FCM).
  - **SMS**: Transactional updates (Booking Confirmed, Professional Arrived).
  - **Email**: Monthly statements and marketing updates via SendGrid.
- [ ] **4.3 Event-Driven Triggers**
  - Implement a simple internal event emitter or use a queue (BullMQ) to trigger notifications asynchronously.

---

## Phase 5: Operations, Analytics & CMS
*Objective: Empower admins with data and control over the platform.*

- [ ] **5.1 Advanced Analytics Engine**
  - Implement daily/weekly/monthly revenue reports.
  - Track "Top Performing Vendors" and "User Churn Rates".
  - Export data to CSV/PDF for accounting.
- [ ] **5.2 Reward & Loyalty Program**
  - Implement logic to award `points` based on booking value.
  - Add "Redeem Points" logic during the checkout process.
- [ ] **5.3 Dynamic CMS**
  - Backend control for Home Page banners, trending categories, and featured salons.
  - Manage "Legal" pages (Terms, Privacy) via the Admin portal.
- [ ] **5.4 Audit Logging**
  - Implement middleware to log all Admin actions (Vendor approval, commission changes) for security audits.

---

## Phase 6: Final QA, Documentation & Launch
*Objective: Ensure stability and developer handoff.*

- [ ] **6.1 API Documentation**
  - Implement Swagger/OpenAPI for all modules.
- [ ] **6.2 Testing Suite**
  - Integration tests for the Booking flow and Payment webhooks.
  - Load testing for high-traffic scenarios (e.g., Festival seasons).
- [ ] **6.3 Deployment & CI/CD**
  - Setup GitHub Actions for automated testing and deployment to Vercel/Render/AWS.
  - Configure Environment variable management for Production.
